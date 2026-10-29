# Portofolio Pengembang Web Interaktif Berbasis AI & Headless CMS Google Sheets

Situs portofolio web interaktif modern berbasis **Next.js 14**, **TypeScript**, dan **Tailwind CSS** yang memanfaatkan **Google Sheets sebagai Headless CMS (Zero Database)** dan dilengkapi **AI Assistant interaktif berbasis Google Gemini API**.

Sistem ini memungkinkan pengembang web untuk mengelola seluruh konten portofolio—mulai dari profil, galeri proyek, riwayat pekerjaan, pendidikan, keahlian teknis (_tech skills_), hingga dokumentasi modul koding—secara _real-time_ hanya melalui Google Spreadsheet tanpa perlu melakukan _re-deploy_ atau menyentuh basis data.

---

## 🌟 Fitur Utama

- **Headless CMS Berbasis Google Sheets (Zero-Database Architecture)**
  - Sinkronisasi data secara otomatis dan _real-time_ dari Google Spreadsheet menggunakan library `google-spreadsheet` v4.
  - Dilengkapi sistem _fallback mock data_ untuk memastikan aplikasi tetap berjalan stabil jika koneksi spreadsheet terputus.
  - Mekanisme perlindungan sheet sistem (`SYSTEM_SHEET_KEYWORDS`) agar tab internal CMS (seperti _projects_, _skills_, _experiences_) tidak bocor ke publik sebagai modul dokumentasi.

- **AI Assistant Interaktif (Google Gemini API)**
  - _Widget_ AI chat terintegrasi yang dapat menjawab pertanyaan pengunjung/recruiter secara kontekstual mengenai kualifikasi, pengalaman, dan latar belakang pengembang.

- **Galeri & Detail Proyek Dinamis (`/projects`)**
  - Preview 6 proyek unggulan di halaman utama.
  - Halaman Galeri Lengkap (`/projects`) dengan pencarian kata kunci _real-time_ (judul, deskripsi, _tech stack_) dan pengurutan kronologis terbalik (_newest first_).
  - Halaman Detail Proyek (`/projects/[id]`) untuk eksplorasi informasi mendalam tiap proyek.

- **Kategori Tech Skills Dinamis & Proficiency Badges**
  - Pengelompokan _skills_ secara otomatis berdasarkan kategori (misal: _Frontend Development_, _Backend & CMS_, _AI & Automation_, _Tools_).
  - Tampilan _badge_ interaktif yang dilengkapi _level proficiency_ (_Advanced_, _Intermediate_, _Beginner_).

- **Dokumentasi Modul & Kode Interaktif (`/[slug]`)**
  - Pembuatan halaman dokumentasi teknis dinamis berdasarkan tab spreadsheet.
  - Sistem **Tab Filter Sub-Kategori** (`Semua`, `HTML`, `CSS`, `JavaScript`, dll.) untuk mempermudah navigasi fungsi/modul koding.
  - Fitur pencarian kodingan cepat dan tautan langsung ke repositori GitHub.

- **Format Teks Dinamis (`<FormattedText />`)**
  - Dukungan penulisan sintaks Markdown tebal (`**kata kunci**`) langsung dari sel Google Spreadsheet tanpa pustaka tambahan yang berat.

- **UI/UX Modern & Responsif**
  - Desain _Dark Mode_ elegan dengan efek _grid pattern_, _glassmorphism_, ikonik Lucide React, tombol CTA _Download CV ATS_, serta formulir kontak terintegrasi.

---

## 🛠️ Arsitektur & Teknologi

| Komponen               | Teknologi                   | Keterangan                                      |
| :--------------------- | :-------------------------- | :---------------------------------------------- |
| **Framework Utama**    | Next.js 14 (Pages Router)   | Server-Side Rendering (SSR) & Dynamic Routing   |
| **Bahasa Pemrograman** | TypeScript 5                | Type-safety penuh pada data fetching & komponen |
| **Styling & UI**       | Tailwind CSS + Lucide Icons | Responsive Dark Theme dengan Grid Pattern UI    |
| **Content Management** | Google Sheets API v4        | Headless CMS terhubung ke spreadsheet           |
| **AI Integration**     | Google Gemini API           | Asisten AI berbasis LLM kontekstual             |
| **State & Parsing**    | Regex Parser & React Hooks  | Pengelompokan data dinamis & pemroses teks bold |

---

## 📊 Struktur Google Spreadsheet (CMS Schema)

Untuk menjalankan situs ini, buat Google Spreadsheet dengan nama tab/sheet berikut:

### 1. Tab `profile` (Profil Pengembang)

| Header Kolom   | Contoh Isi                                                         |
| :------------- | :----------------------------------------------------------------- |
| `Name`         | Nama Lengkap Anda                                                  |
| `Title`        | Full-Stack Web Developer                                           |
| `Summary`      | Pengembang web berfokus pada **Next.js** dan **AI Integration**... |
| `Email`        | alamat_email_anda                                                  |
| `Location`     | Indonesia                                                          |
| `CV_Link`      | Tautan CV ATS Anda                                                 |
| `Avatar_Url`   | Tautan Foto Profil Anda                                            |
| `GitHub_Url`   | Tautan Profil GitHub Anda                                          |
| `LinkedIn_Url` | Tautan Profil LinkedIn Anda                                        |

### 2. Tab `projects` (Daftar Proyek)

| Header Kolom  | Contoh Isi                                                    |
| :------------ | :------------------------------------------------------------ |
| `Title`       | Dynamic Portfolio & CMS                                       |
| `Description` | Aplikasi web portofolio terintegrasi **Google Sheets API**... |
| `Image_Url`   | Tautan Gambar/Thumbnail Proyek                                |
| `Tech_Stack`  | Next.js 14, TypeScript, Google Sheets API, Tailwind CSS       |
| `Demo_Link`   | Tautan Web Live Demo Proyek                                   |
| `GitHub_Link` | Tautan Repositori GitHub Proyek                               |
| `Status`      | Production                                                    |

### 3. Tab `experience` (Pengalaman Kerja)

| Header Kolom  | Contoh Isi                                                |
| :------------ | :-------------------------------------------------------- |
| `Role`        | Full-Stack Web Developer                                  |
| `Company`     | Independent Developer / Perusahaan                        |
| `Period`      | 2023 - Sekarang                                           |
| `Description` | Mengembangkan sistem web dinamis dengan **Next.js 14**... |
| `Location`    | Indonesia                                                 |

### 4. Tab `education` (Riwayat Pendidikan)

| Header Kolom  | Contoh Isi                                               |
| :------------ | :------------------------------------------------------- |
| `Degree`      | Sarjana Informatika                                      |
| `Institution` | Perguruan Tinggi                                         |
| `Year`        | 2019 - 2023                                              |
| `Description` | Fokus pada Rekayasa Perangkat Lunak dan Web Architecture |

### 5. Tab `skills` (Tech Stack & Key Skills)

| Header Kolom | Contoh Isi           |
| :----------- | :------------------- |
| `Category`   | Frontend Development |
| `Skill`      | Next.js 14           |
| `Level`      | Advanced             |

### 6. Tab Dokumentasi Khusus (misal: `HTML & CSS` atau `Web Dev`)

| Header Kolom  | Contoh Isi                                          |
| :------------ | :-------------------------------------------------- |
| `Nama Fungsi` | CSS Grid Auto-Fit Responsive                        |
| `Kategori`    | CSS                                                 |
| `Catatan`     | Layout responsif otomatis menggunakan `minmax()`... |
| `Link Github` | Tautan Repositori GitHub Praktik                    |

---

## 🚀 Panduan Instalasi & Pengoperasian Lokal

### 1. Prasyarat System

- Node.js versi 18.x atau lebih baru
- npm, yarn, atau pnpm
- Spreadsheet Google dengan Google Sheets API diaktifkan

### 2. Instalasi & Jalankan Proyek

```bash
# Instal dependensi
npm install

# Jalankan server lokal
npm run dev
```

Buka browser dan akses `http://localhost:3000`.

### 3. Konfigurasi Kredensial Environment

Buat file konfigurasi lingkungan lokal, lalu atur kredensial berikut:

- Email kualifikasi autentikasi Google Cloud
- Kunci autentikasi privat Google Cloud
- ID unik dokumen Google Spreadsheet
- API Key Google Gemini AI

> **Catatan:** Pastikan spreadsheet Anda telah dibagikan (_share_) dengan hak akses pembaca (_Viewer_) ke email otentikasi Google Cloud Anda.

---

## 🎨 Kustomisasi Fitur

### Format Teks Bold Dinamis

Anda dapat menebalkan kata kunci tertentu langsung pada sel Google Spreadsheet dengan mengapit kata menggunakan tanda `**`:

```text
Mengembangkan sistem terintegrasi **Next.js 14** dan **Google Sheets API**.
```

Komponen `<FormattedText />` di aplikasi akan otomatis merender kata tersebut menjadi teks tebal (`<strong>`).

### Favicon Tab Browser Custom

Simpan ikon kustom Anda (`favicon.ico` atau `icon.png`) di folder `public/`, lalu panggil pada tag `<Head>` di `pages/index.tsx`.

---

## 📄 Lisensi

Proyek ini terbuka di bawah lisensi MIT.
