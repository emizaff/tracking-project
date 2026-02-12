# 🚀 Tracking Project v1

[![Project Challenge](https://img.shields.io/badge/2026_Challenge-Project_1_of_12-f01036?style=for-the-badge)](https://github.com/emizaff)
[![Runtime](https://img.shields.io/badge/Runtime-Bun_v1.2-black?style=for-the-badge&logo=bun)](https://bun.sh)
[![Environment](https://img.shields.io/badge/OS-WSL_Ubuntu-orange?style=for-the-badge&logo=ubuntu)](https://ubuntu.com)
[![Status](https://img.shields.io/badge/Status-Live_Production-success?style=for-the-badge&logo=netlify)](https://tracking-project-public.netlify.app)

**Tracking Project** adalah platform manajemen produktivitas modern yang menggabungkan elemen **Gamifikasi RPG** (Level/XP) dengan pelacakan tugas real-time. Proyek ini dibangun sebagai pembuka dari resolusi tantangan **12 Project dalam 1 Tahun (2026)**.

Tujuan utamanya bukan hanya mencatat tugas, tapi membangun ekosistem kerja yang imersif, transparan, dan memotivasi.

<p align="center">
  <img src="docs/tracking-project-dashboard.jpeg" alt="Tracking Project Gamified Dashboard Preview" width="100%" style="border-radius: 10px; box-shadow: 0 0 20px rgba(240, 16, 54, 0.2);">
  <br>
  <i>Tampilan Dashboard Admin (Dark Mode)</i>
</p>

---

## 🌐 Live Demo

| Portal | URL | Deskripsi |
| :--- | :--- | :--- |
| **Public Showcase** | [tracking-project-public.netlify.app](https://tracking-project-public.netlify.app) | Halaman publik untuk melihat progress proyek & kirim ide. |
| **Admin Dashboard** | [tracking-project-admin.netlify.app](https://tracking-project-admin.netlify.app) | Pusat kontrol manajemen tugas (Login Required). |

---

## ✨ Fitur Unggulan

### 🎮 Gamifikasi & Produktivitas
- **RPG Leveling System:** Dapatkan XP setiap menyelesaikan tugas. Naik level untuk membuka *achievement* personal.
- **Activity Heatmap:** Visualisasi konsistensi kerja 365 hari terakhir ala kontribusi GitHub.
- **Smart Task Input:** Input tugas cepat dengan mode **Timer (Fokus)** atau **Counter (Jumlah Repetisi)**.
- **Side Quests (Loot):** Sistem tabungan otomatis visual untuk melacak progress pembelian barang impian (Wishlist).

### 📊 Analisis & Laporan
- **Interactive Reports:** Grafik mingguan untuk memantau jam fokus dan rasio penyelesaian tugas.
- **Focus Session:** Mode "Deep Work" dengan timer terintegrasi.

### 🌍 Build in Public
- **Public API:** Endpoint khusus untuk menampilkan data proyek terpilih ke halaman publik.
- **Idea Submission:** Fitur bagi pengunjung anonim untuk mengirimkan ide proyek liar kepada developer.

---

## 🛠️ Tech Stack

Dibangun dengan performa tinggi menggunakan ekosistem modern:

- **Runtime:** [Bun](https://bun.sh) (Fast JavaScript runtime & package manager).
- **Backend:** [Elysia.js](https://elysiajs.com) (Framework server super cepat).
- **Database:** PostgreSQL (Hosted on [Neon DB](https://neon.tech)) + [Drizzle ORM](https://orm.drizzle.team).
- **Frontend Admin:** [React 18](https://reactjs.org) (Vite) + [Tailwind CSS](https://tailwindcss.com).
- **Frontend Public:** [Astro v5](https://astro.build) (Static Site Generation untuk SEO & Speed).
- **Deployment:** [Koyeb](https://koyeb.com) (Server) & [Netlify](https://netlify.com) (Client).

---

## 📥 Panduan Instalasi (Local Development)

Pastikan Anda menjalankan perintah ini di dalam lingkungan **WSL (Ubuntu)** untuk kompatibilitas terbaik dengan Bun.

### 1. Prasyarat
Install Bun jika belum ada:
```bash
curl -fsSL [https://bun.sh/install](https://bun.sh/install) 
```
### 2. Clone Repository
```bash
git clone [https://github.com/emizaff/tracking-project.git](https://github.com/emizaff/tracking-project.git)
cd tracking-project
```

### 3. Setup Backend (Server)

```bash
cd server
bun install
```
Buat file ```.env``` di folder server dan isi dengan ```DATABASE_URL```  PostgreSQL Anda.

Jalankan migrasi database:
```bunx drizzle-kit push```

Jalankan server: ```bun dev```

### 4. Setup Admin Dashboard
Buka terminal baru di WSL:
```bash
cd tracking-project/admin-dashboard
bun install
bun dev
```
Akses dashboard di: ```http://localhost:5173```

---
## 🏁 Resolusi 2026: 12 Projects Challenge
- [x] Project 1 (Jan-Feb): Tracking Project (Tracking-Project) - **SELESAI**
- [ ] Project 2 (Maret): **(Segera Hadir)**

---

## 🎨 Branding Guide
- Background: ```#090909``` (Pure Dark)
- Component Card: ```#1A1A1A``` (Dark Grey)
- Accent Color: ```#f01036``` (Neon Red)
- Text: `#ffffff` (Primary), ```#888888``` (Secondary)

### Logo
<p align="center">
  <img src="docs/Logo.png" alt="Logo Tracking Project" width="35%"> 
  <img src="docs/Logo1.png" alt="Logo Tracking Project v2" width="35%">
  <img src="docs/Logo3.png" alt="Logo Tracking Project3" width="35%">
  <img src="docs/Logo4.png" alt="Logo Tracking Project" width="35%">
  <img src="docs/Logo7.png" alt="Logo Tracking Project" width="35%">
  <br>
  <i>Beberapa Logo dengan variasi warna yang berbeda</i>

</p>
