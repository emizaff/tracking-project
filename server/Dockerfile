# Gunakan base image Bun resmi
FROM oven/bun:1 as base
WORKDIR /app

# Copy file package (Cukup package.json aja)
COPY package.json ./

# 🔥 PERBAIKAN: Hapus "--production" biar semua tools ikut ke-install
RUN bun install

# Copy semua kode server
COPY . .

# Generate Client Drizzle (Sekarang pasti berhasil karena tools-nya udah ke-install)
RUN bun run db:generate

# Expose port
EXPOSE 3000

# Jalankan server
CMD ["bun", "run", "src/index.ts"]