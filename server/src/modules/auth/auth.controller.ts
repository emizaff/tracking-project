// server/src/modules/auth/auth.controller.ts
import { Elysia, t } from "elysia";
import { AuthService } from "./auth.service";
import { db } from "../../db";
import { users, sessions } from "../../db/schema/auth.schema";
import { eq } from "drizzle-orm"; 
import { v4 as uuidv4 } from "uuid";

// URL Frontend (Netlify) - Pastikan ini sesuai
const FRONTEND_URL = "https://tracking-project-admin.netlify.app";

export const authController = new Elysia({ prefix: "/auth" })
    
    // --- 1. Redirect ke Google Login Page ---
    .get("/google", ({ redirect }) => {
        const url = AuthService.getGoogleAuthURL();
        return redirect(url);
    })

    // --- 2. Callback Google (Logic Redirect Pintar) ---
    .get("/google/callback", async ({ query, cookie, redirect }) => {
        try {
            const code = query.code as string;
            if(!code) throw new Error("Code tidak ditemukan");

            const result = await AuthService.handleGoogleCallback(code);

            // A. JIKA SUDAH PUNYA AKUN -> LOGIN LANGSUNG
            if (result.status === 'LOGIN') {
                
                // 🔥 SETTING COOKIE SAKTI (WAJIB BEGINI)
                cookie.session_id.set({
                    value: result.token!,
                    httpOnly: true,
                    path: "/",
                    maxAge: 7 * 86400, // 7 Hari
                    sameSite: "none",      // 👈 WAJIB: Biar bisa nyebrang domain (Netlify -> Koyeb)
                    secure: true,          // 👈 WAJIB: Karena lewat HTTPS
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
    .post("/register", async ({ body, cookie, set }) => {
        const { email, username, password, googleId, picture } = body as any;

        try {
            // Cek duplikasi email dulu biar gak error 500
            const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
            if (existingUser) {
                set.status = 400;
                return { success: false, message: "Email sudah terdaftar!" };
            }

            const [newUser] = await db.insert(users).values({
                email,
                username,
                password: password || "", 
                googleId,
                picture,
                level: 1,
                xp: 0
            }).returning();

            // Buat Session Baru
            const token = uuidv4();
            const expiresAt = Math.floor(Date.now() / 1000) + (7 * 86400);
            
            await db.insert(sessions).values({
                id: token,
                userId: newUser.id,
                expiresAt
            });

            // 🔥 SETTING COOKIE REGISTER
            cookie.session_id.set({
                value: token,
                httpOnly: true,
                path: "/",
                maxAge: 7 * 86400,
                sameSite: "none",      // 👈 WAJIB
                secure: true,          // 👈 WAJIB
            });

            return { success: true, user: newUser };
        } catch (error: any) {
            console.error("Register Error:", error);
            set.status = 500;
            return { success: false, message: error.message };
        }
    })

    // --- 4. Endpoint LOGIN MANUAL (Email + Password) ---
    .post("/login", async ({ body, cookie, set }) => {
        const { email, password } = body as any;

        try {
            const user = await db.query.users.findFirst({
                where: eq(users.email, email)
            });

            if (!user) {
                set.status = 400;
                return { success: false, message: "Email tidak terdaftar" };
            }

            // Cek Password Sederhana (Harusnya pake bcrypt/argon2, tapi ini sesuai request awal Abang)
            if (user.password !== password) {
                set.status = 400;
                return { success: false, message: "Password salah!" };
            }

            // Buat Session
            const token = uuidv4();
            const expiresAt = Math.floor(Date.now() / 1000) + (7 * 86400); 
            
            await db.insert(sessions).values({
                id: token,
                userId: user.id,
                expiresAt
            });

            // 🔥 SETTING COOKIE LOGIN MANUAL
            cookie.session_id.set({
                value: token,
                httpOnly: true,
                path: "/",
                maxAge: 7 * 86400,
                sameSite: "none",      // 👈 WAJIB
                secure: true,          // 👈 WAJIB
            });

            return { success: true, user };

        } catch (error: any) {
            console.error("Login Error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })

    // --- 5. Logout (Hapus Cookie & Session DB) ---
    .post("/logout", async ({ cookie }) => {
        if (cookie.session_id.value) {
            // Hapus dari DB (Optional tapi bagus buat kebersihan)
            await AuthService.logout(cookie.session_id.value); 
            
            // 🔥 HAPUS COOKIE DENGAN SETTING YANG SAMA
            // Browser gak mau hapus kalau setting secure/samesite-nya beda sama pas login
            cookie.session_id.set({
                value: "",
                httpOnly: true,
                path: "/",
                maxAge: 0,             // Langsung Expired
                sameSite: "none",      // 👈 Harus sama persis
                secure: true,          // 👈 Harus sama persis
            });
        }
        return { success: true, message: "Logout berhasil" };
    })

    // --- 6. Cek Profile User (Me) ---
    .get("/me", async ({ cookie, set }) => {
        if(!cookie.session_id.value) {
            set.status = 401;
            return { user: null };
        }
        
        const user = await AuthService.getSession(cookie.session_id.value);
        if (!user) {
            set.status = 401;
            return { user: null };
        }
        
        return { user };
    });