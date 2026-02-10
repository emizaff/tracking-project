# Gunakan base image Bun resmi
FROM oven/bun:1 as base
WORKDIR /app

# Copy file package (resep dependency)
COPY package.json bun.lockb ./

# Install dependencies (bahan-bahan)
RUN bun install --production

# Copy semua kode server
COPY . .

# Generate Client Drizzle (PENTING BIAR GAK ERROR SCHEMA)
RUN bun run db:generate

# Expose port (Render biasanya pake port dinamis, tapi kita buka 3000)
EXPOSE 3000

# Jalankan server
CMD ["bun", "run", "src/index.ts"]