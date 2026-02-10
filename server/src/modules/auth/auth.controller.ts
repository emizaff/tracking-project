// server/src/modules/auth/auth.controller.ts
import { Elysia, t } from "elysia";
import { AuthService } from "./auth.service";
import { db } from "../../db";
import { users, sessions } from "../../db/schema/auth.schema";
import { eq } from "drizzle-orm"; // 👈 Jangan lupa import ini
import { v4 as uuidv4 } from "uuid";

// URL Frontend (React)
const FRONTEND_URL = "https://faiq-tracking-project.netlify.app";

export const authController = new Elysia({ prefix: "/auth" })
  
  // --- 1. Redirect ke Google ---
  .get("/google", ({ redirect }) => {
    const url = AuthService.getGoogleAuthURL();
    return redirect(url);
  })

  // --- 2. Callback Google (Logika Redirect Pintar) ---
  .get("/google/callback", async ({ query, cookie, redirect }) => {
    try {
        const code = query.code as string;
        if(!code) throw new Error("Code tidak ditemukan");

        const result = await AuthService.handleGoogleCallback(code);

        // A. JIKA SUDAH PUNYA AKUN -> LOGIN LANGSUNG
        if (result.status === 'LOGIN') {
            const isProduction = process.env.NODE_ENV === 'production';
            cookie.session_id.set({
                value: result.token!,
                httpOnly: true,
                path: "/",
                maxAge: 7 * 86400,
                sameSite: "lax",
                secure: isProduction,
            });

            return redirect(`${FRONTEND_URL}/dashboard`);
        }

        // B. JIKA BELUM PUNYA AKUN -> LEMPAR KE REGISTER FORM
        else if (result.status === 'REGISTER') {
            const data = result.googleData!;
            const params = new URLSearchParams({
                email: data.email,
                name: data.name,
                picture: data.picture,
                googleId: data.googleId,
                isGoogleLogin: "true"
            });

            return redirect(`${FRONTEND_URL}/register?${params.toString()}`);
        }

    } catch (error: any) {
        console.error("🔥 ERROR GOOGLE LOGIN:", error);
        return redirect(`${FRONTEND_URL}/login?error=google_failed`);
    }
  })

  // --- 3. Endpoint Register (User Baru) ---
  .post("/register", async ({ body, cookie }) => {
      const { email, username, password, googleId, picture } = body as any;

      try {
        // Simpan User Baru
        const [newUser] = await db.insert(users).values({
            email,
            username,
            password: password || "", // Password boleh kosong kalau login Google
            googleId,
            picture,
            level: 1,
            xp: 0
        }).returning();

        // Buat Session Login Otomatis
        const token = uuidv4();
        const expiresAt = Math.floor(Date.now() / 1000) + (7 * 86400);
        
        await db.insert(sessions).values({
            id: token,
            userId: newUser.id,
            expiresAt
        });

        // Set Cookie biar langsung login
        cookie.session_id.set({
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 86400,
        });

        return { success: true, user: newUser };
      } catch (error: any) {
          console.error("Register Error:", error);
          return { success: false, message: error.message };
      }
  })

  // --- 4. Endpoint LOGIN MANUAL (Email + Password) [BARU] ---
  .post("/login", async ({ body, cookie, set }) => {
      const { email, password } = body as any;

      try {
        // Cari user berdasarkan email
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            set.status = 400;
            return { success: false, message: "Email tidak terdaftar" };
        }

        // Cek apakah user ini khusus Google Login (Password kosong)
        if (!user.password && user.googleId) {
            set.status = 400;
            return { success: false, message: "Akun ini terdaftar via Google. Silakan klik tombol Google." };
        }

        // Cek Password (Sementara Direct Compare, nanti bisa pakai Bun.password.verify)
        if (user.password !== password) {
             set.status = 400;
             return { success: false, message: "Password salah!" };
        }

        // LOGIN SUKSES -> Buat Session
        const token = uuidv4();
        const expiresAt = Math.floor(Date.now() / 1000) + (7 * 86400); // 7 Hari
        
        await db.insert(sessions).values({
            id: token,
            userId: user.id,
            expiresAt
        });

        // Set Cookie
        const isProduction = process.env.NODE_ENV === 'production';
        cookie.session_id.set({
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 86400,
            sameSite: "lax",
            secure: isProduction,
        });

        return { success: true, user };

      } catch (error: any) {
          console.error("Login Error:", error);
          return { success: false, message: "Terjadi kesalahan server" };
      }
  })

  // --- 5. Logout & Get Profile ---
  .post("/logout", async ({ cookie }) => {
    if (cookie.session_id.value) {
        await AuthService.logout(cookie.session_id.value);
        cookie.session_id.remove();
    }
    return { success: true };
  })

  .get("/me", async ({ cookie }) => {
      if(!cookie.session_id.value) return { user: null };
      const user = await AuthService.getSession(cookie.session_id.value);
      return { user };
  });