import { db } from "../../db";
import { users, sessions } from "../../db/schema/auth.schema"; // Pastikan path schema benar
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const AuthService = {
  // --- 1. Generate Google Login URL ---
  getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  },

  // --- 2. Tukar Code jadi User Data ---
  async handleGoogleCallback(code: string) {
    // A. Ambil Token
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenParams = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
        grant_type: "authorization_code",
    };

    const tokenRes = await fetch(tokenUrl, { 
        method: "POST", 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(tokenParams) 
    });
    
    const tokenData = await tokenRes.json() as any;
    if (!tokenData.access_token) throw new Error("Gagal mengambil token Google");

    // B. Ambil Info User
    const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`);
    const googleUser = await userRes.json() as any;

    if (!googleUser.email) throw new Error("Email Google tidak ditemukan");

    // C. Cek Database
    const user = await db.query.users.findFirst({ where: eq(users.email, googleUser.email) });

    // 🔥 SKENARIO 1: USER SUDAH ADA (LOGIN)
    if (user) {
        // Update foto/googleId jika belum ada
        if (!user.googleId) {
            await db.update(users)
                .set({ googleId: googleUser.id, picture: googleUser.picture })
                .where(eq(users.id, user.id));
        }

        // Buat Session
        const token = uuidv4();
        const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
        await db.insert(sessions).values({ id: token, userId: user.id, expiresAt });

        return { status: 'LOGIN', token, user };
    } 
    
    // 🔥 SKENARIO 2: USER BELUM ADA (BUTUH REGISTER)
    else {
        // Jangan simpan ke DB dulu! Kembalikan data Google-nya.
        return { 
            status: 'REGISTER', 
            googleData: {
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                googleId: googleUser.id
            }
        };
    }
  },

  async logout(token: string) {
    await db.delete(sessions).where(eq(sessions.id, token));
  },
  
  async getSession(token: string) {
      const session = await db.query.sessions.findFirst({
          where: eq(sessions.id, token),
          with: { user: true }
      });
      if (!session || Date.now() / 1000 > session.expiresAt) return null;
      return session.user;
  }
};