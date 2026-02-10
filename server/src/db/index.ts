// server/src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 👇 KITA IMPORT MANUAL SATU-SATU
import * as authSchema from "./schema/auth.schema";
import * as appSchema from "./schema/app.schema";
import * as trackingSchema from "./schema/tracking.schema";

// 👇 GABUNGKAN SCHEMA
const schema = {
  ...authSchema,
  ...appSchema,
  ...trackingSchema,
};

// Debug Relasi
console.log("🔍 CEK SCHEMA RELATIONS:");
// @ts-ignore
console.log("Projects Relations ada?", !!schema.projectsRelations); 
// @ts-ignore
console.log("Tasks Relations ada?", !!schema.tasksRelations);      

// 1. AMBIL URL DULU (DEFINISI VARIABEL)
const connectionString = process.env.DATABASE_URL;

// 2. BARU DI-LOG (MATA-MATA) SETELAH VARIABEL DIBUAT
console.log("---------------------------------------------");
console.log("🕵️ MATA-MATA DATABASE:");
console.log("👉 URL yang dibaca Server:", connectionString); 
console.log("---------------------------------------------");

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

// 3. KONEKSI
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });