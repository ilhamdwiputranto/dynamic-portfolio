# Dynamic Portfolio & Headless Spreadsheet CMS - Ilham Dwi Putranto

Situs portofolio web dinamis berbasis Next.js 14, Tailwind CSS, Google Sheets API, dan Google AI Studio (Gemini API) untuk Ilham Dwi Putranto.

---

## Fitur Utama (v8.0)

1. Headless Google Sheets CMS:
   Data profil, profesional summary, proyek showcase, pengalaman kerja, pendidikan, dan tech skills diambil secara real-time dari Google Spreadsheet.
2. Personalized UI untuk Ilham Dwi Putranto:
   Foto profil / placeholder yang mudah diganti via Sheet Profiling.
   Tombol aksentuasi tinggi untuk Download CV ATS (terhubung langsung dengan Google Docs CV).
3. AI Assistant Interaktif (Google AI Studio Gemini API):
   Pengunjung dapat bertanya langsung tentang profil, keahlian, pengalaman, dan proyek Ilham Dwi Putranto.
4. Dynamic Project Showcase:
   Menampilkan kartu proyek lengkap dengan foto screenshot, status, tag tech stack, dan link repositori/demo.
5. Dynamic Experience & Education Timelines:
   Riwayat karir dan pendidikan terstruktur dan dinamis.
6. Contact Form / Leave a Message:
   Form kontak pengirim pesan yang terintegrasi.

---

## Struktur Sheet Google Spreadsheet

1. Tab `Profiling`
   Headers: Nama | Title | Summary | Link_CV | Foto_URL | Email | GitHub | LinkedIn | Lokasi
2. Tab `Projects`
   Headers: Judul | Deskripsi | Screenshot_URL | Link | Status | Tech_Stack
3. Tab `Experience`
   Headers: Jabatan | Perusahaan | Periode | Deskripsi | Lokasi
4. Tab `Education`
   Headers: Gelar | Institusi | Tahun | Deskripsi
5. Tab Skill Kustom (seperti `HTML-CSS`, `JavaScript`, `React`, `Python`)
   Headers: nama_fungsi | kesan | link_github

---

## Environment Variables (.env.local)

```env
SHEET_ID=ID_SPREADSHEET_ANDA
SERVICE_EMAIL=my-service-account@project.iam.gserviceaccount.com
PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

---

## Cara Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser Anda!
