import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 👇 PERUBAHAN PENTING: Tunjuk langsung ke file index.ts!
  schema: [
    "./src/db/schema/auth.schema.ts",
    "./src/db/schema/app.schema.ts",
    "./src/db/schema/tracking.schema.ts"
  ],
  
  out: "./drizzle",
  
  dialect: "postgresql",
  
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
  
  verbose: true,
  strict: true,
});