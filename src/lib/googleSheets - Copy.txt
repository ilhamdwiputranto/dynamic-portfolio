import { formatImageUrl, slugify } from "@/lib/utils";

export const SYSTEM_SHEET_KEYWORDS = [
  "profile",
  "profiling",
  "about",
  "bio",
  "biodata",
  "project",
  "projects",
  "proyek",
  "portofolio",
  "experience",
  "pengalaman",
  "karir",
  "pekerjaan",
  "job",
  "education",
  "pendidikan",
  "studi",
  "sekolah",
  "kuliah",
  "message",
  "messages",
  "kontak",
  "contact",
  "testimonial",
  "testimonials",
  "kesan",
  "oranglain",
  "rating",
  "ratings",
  "ulasan",
  "feedback",
];

import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {
  SkillCategory,
  SkillItem,
  UserProfile,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  TestimonialItem,
  PortfolioFullData,
} from "@/types/portfolio";

const MOCK_CATEGORIES: SkillCategory[] = [
  { title: "HTML & CSS", slug: "html-css", itemCount: 8, description: "Layout, Flexbox, CSS Grid & UI Styling" },
  { title: "JavaScript Fundamentals", slug: "javascript-fundamentals", itemCount: 12, description: "ES6+, Async Operations & DOM Manipulation" },
  { title: "React & Next.js", slug: "react-nextjs", itemCount: 10, description: "Hooks, State, SSR & Dynamic API Routes" },
  { title: "Python & Automation", slug: "python-automation", itemCount: 6, description: "Data Wrangling, Pandas & API Scripting" },
];

const MOCK_ITEMS: Record<string, SkillItem[]> = {
  "html-css": [
    {
      id: "1",
      namaFungsi: "CSS Grid Auto-Fit Responsive",
      catatan: "Membawa elemen responsif secara alami tanpa media queries berlebih",
      linkGithub: "#",
      category: "HTML & CSS",
    },
    {
      id: "2",
      namaFungsi: "Flexbox Centering & Space Around",
      catatan: "Sangat berguna untuk menyusun tata letak elemen kartu dan tombol",
      linkGithub: "#",
      category: "HTML & CSS",
    },
  ],
  "javascript-fundamentals": [
    {
      id: "1",
      namaFungsi: "Array.prototype.reduce() Aggregation",
      catatan: "Sangat efisien untuk pengelompokkan dan kalkulasi total data",
      linkGithub: "#",
      category: "JavaScript Fundamentals",
    },
    {
      id: "2",
      namaFungsi: "Async/Await error handling dengan try-catch",
      catatan: "Penanganan error fetch API yang bersih dan aman",
      linkGithub: "#",
      category: "JavaScript Fundamentals",
    },
  ],
  "react-nextjs": [
    {
      id: "1",
      namaFungsi: "Next.js Dynamic Route ([slug].tsx)",
      catatan: "Membaca param URL untuk merender halaman kategori spreadsheet secara otomatis",
      linkGithub: "#",
      category: "React & Next.js",
    },
    {
      id: "2",
      namaFungsi: "useCallback & useMemo Hooks",
      catatan: "Mengoptimalkan performa re-render komponen React",
      linkGithub: "#",
      category: "React & Next.js",
    },
  ],
  "python-automation": [
    {
      id: "1",
      namaFungsi: "Pandas DataFrame Excel/CSV Export",
      catatan: "Mengarahkan data terstruktur menjadi laporan otomatis",
      linkGithub: "#",
      category: "Python & Automation",
    },
  ],
};

export async function getSpreadsheet() {
  const email = process.env.SERVICE_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let rawKey = process.env.PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "";
  if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
    rawKey = rawKey.slice(1, -1);
  }
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const sheetId = process.env.SHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !privateKey || !sheetId) {
    console.warn("[Google Sheets] Kredensial tidak ditemukan di process.env");
    return null;
  }

  const serviceAccountAuth = new JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file", "https://spreadsheets.google.com/feeds"],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function getAllCategories(): Promise<SkillCategory[]> {
  try {
    const doc = await getSpreadsheet();
    if (!doc) return MOCK_CATEGORIES;

    const categories: SkillCategory[] = [];
    for (let i = 0; i < doc.sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      const titleLower = sheet.title.toLowerCase().trim();

      const isSystemSheet = SYSTEM_SHEET_KEYWORDS.some((k) => titleLower === k);
      if (isSystemSheet) {
        continue;
      }

      const rows = await sheet.getRows();
      categories.push({
        title: sheet.title,
        slug: slugify(sheet.title),
        itemCount: rows.length,
        description: `Kumpulan ${rows.length} fungsi & praktik pada kategori ${sheet.title}`,
      });
    }
    return categories;
  } catch (error) {
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryData(slug: string): Promise<{ category: SkillCategory | null; items: SkillItem[] }> {
  const isSystemSlug = SYSTEM_SHEET_KEYWORDS.some((k) => slug === k);
  if (isSystemSlug) {
    return { category: null, items: [] };
  }
  try {
    const doc = await getSpreadsheet();
    if (!doc) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
      const items = MOCK_ITEMS[slug] || [];
      return { category: cat, items };
    }

    let targetSheet = null;
    for (let i = 0; i < doc.sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      if (slugify(sheet.title) === slug) {
        targetSheet = sheet;
        break;
      }
    }

    if (!targetSheet) {
      return { category: null, items: [] };
    }

    const rows = await targetSheet.getRows();
    const items: SkillItem[] = rows.map((row, index) => {
      let namaFungsi = row.get("nama_fungsi") || row.get("Nama Fungsi") || row.get("Fungsi") || row.get("namaFungsi") || `Fungsi #${index + 1}`;
      let catatan = row.get("kesan") || row.get("Kesan / Catatan") || row.get("Catatan") || row.get("Kesan") || "-";
      const rowObj = (row as any).toObject ? (row as any).toObject() : {};
      const keys = Object.keys(rowObj);
      const findVal = (pats: string[]) => {
        for (const p of pats) {
          const k = keys.find((key) => key.toLowerCase().trim().includes(p.toLowerCase()));
          if (k && rowObj[k] !== undefined && rowObj[k] !== null && String(rowObj[k]).trim() !== "") {
            return String(rowObj[k]).trim();
          }
        }
        return "";
      };
      const namaFungsiAuto = findVal(["nama_fungsi", "nama fungsi", "fungsi", "modul", "title", "name"]);
      const catatanAuto = findVal(["kesan", "catatan", "note", "evaluasi", "deskripsi"]);
      const linkAuto = findVal(["link_github", "link github", "github", "repo", "link", "url"]);

      if (namaFungsiAuto) {
        namaFungsi = namaFungsiAuto;
      }
      if (catatanAuto) {
        catatan = catatanAuto;
      }
      let linkGithub =
        linkAuto || row.get("link_github") || row.get("Link Github Praktik") || row.get("Link GitHub") || row.get("Link Github") || "#";

      return {
        id: String(index + 1),
        namaFungsi: String(namaFungsi),
        catatan: String(catatan),
        linkGithub: String(linkGithub),
        category: targetSheet.title,
      };
    });

    const category: SkillCategory = {
      title: targetSheet.title,
      slug: slugify(targetSheet.title),
      itemCount: items.length,
      description: `Dokumentasi praktik fungsi & modul untuk ${targetSheet.title}`,
    };

    return { category, items };
  } catch (error) {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
    const items = MOCK_ITEMS[slug] || [];
    return { category: cat, items };
  }
}

export async function getFullPortfolioData(): Promise<PortfolioFullData> {
  const defaultProfile: UserProfile = {
    name: "Ilham Dwi Putranto",
    title: "Full-Stack Web Developer",
    summary:
      "Pengembang web yang berfokus pada pembangunan aplikasi modern menggunakan Next.js, React, TypeScript, serta otomatisasi workflow terintegrasi Google Cloud APIs. Berkomitmen pada transparansi rekam jejak teknis melalui dokumentasi terstruktur.",
    email: "ilhamdwiputranto09@gmail.com",
    location: "Indonesia",
    cvUrl: "https://docs.google.com",
    avatarUrl: "https://lh3.googleusercontent.com/d/1_u8kqgMLUA7aRIvxl4z70gOqWkbyVTSB",
    githubUrl: "https://github.com/ilhamdwiputranto",
    linkedinUrl: "https://linkedin.com/in/ilham-dwi-putranto",
    linktreeUrl: "https://linktr.ee/ilhamdwiputranto",
  };

  const defaultProjects: ProjectItem[] = [
    {
      id: "1",
      title: "Dynamic Spreadsheet Portfolio & CMS",
      description:
        "Situs portofolio dinamis terhubung langsung menggunakan Google Sheets API sebagai Headless CMS, dilengkapi AI Assistant berbasis Google AI Studio Gemini API.",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
      link: "https://github.com/ilhamdwiputranto/dynamic-portfolio",
      demoLink: "https://github.com/ilhamdwiputranto/dynamic-portfolio",
      githubLink: "https://github.com/ilhamdwiputranto/dynamic-portfolio",
      status: "Production",
      techStack: ["Next.js 14", "TypeScript", "Google Sheets API", "Gemini API", "Tailwind CSS"],
    },
    {
      id: "2",
      title: "Workflow Automation & Web Scraper",
      description: "Sistem otomatisasi penataan data spreadsheet dan pemrosesan API berskala berkala menggunakan Python dan Node.js.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      link: "#",
      demoLink: "",
      githubLink: "#",
      status: "Completed",
      techStack: ["Python", "Pandas", "Node.js", "REST API"],
    },
  ];

  const defaultExperiences: ExperienceItem[] = [
    {
      id: "1",
      role: "Full-Stack Web Developer",
      company: "Software House / Independent Developer",
      period: "2023 - Sekarang",
      description:
        "Merancang dan mengembangkan aplikasi web dinamis berkinerja tinggi, mengintegrasikan sistem backend API, dan mengelola otomatisasi CMS.",
      location: "Indonesia",
    },
  ];

  const defaultEducations: EducationItem[] = [
    {
      id: "1",
      degree: "Sarjana Informatika",
      institution: "Perguruan Tinggi",
      year: "2019 - 2023",
      description: "Fokus pada Rekayasa Perangkat Lunak, Struktur Data, Pemrograman Web, dan Basis Data.",
    },
  ];
  const defaultAboutFacts: string[] = [
    "Saya menyukai dunia otomasi & rekayasa web.",
    "Senang bereksperimen dengan arsitektur Headless CMS berbasis Google Cloud APIs & Next.js 14.",
    "Hobi mencatat setiap modul & sintaks pemrograman baru langsung ke dalam Google Spreadsheet.",
    "Suka menikmati kopi sambil melakukan refactoring kode agar lebih bersih dan terstruktur.",
  ];
  const defaultTestimonials: TestimonialItem[] = [
    {
      id: "1",
      nama: "Rian Pratama",
      peran: "Senior Developer & Tech Lead",
      kesan: "Ilham memiliki ketelitian luar biasa dalam mendokumentasikan fungsi kode dan sangat cepat beradaptasi dengan alur kerja tim.",
    },
    {
      id: "2",
      nama: "Siti Sarah",
      peran: "Project Manager",
      kesan: "Pengerjaan fitur tepat waktu, komunikatif, dan solusi headless CMS Google Sheets ini sangat kreatif dan efisien!",
    },
  ];

  let categories: SkillCategory[] = [];
  try {
    categories = await getAllCategories();
  } catch (e) {
    categories = MOCK_CATEGORIES;
  }

  try {
    const doc = await getSpreadsheet();

    if (!doc) {
      return {
        profile: defaultProfile,
        categories,
        projects: defaultProjects,
        experiences: defaultExperiences,
        educations: defaultEducations,
        aboutFacts: defaultAboutFacts,
        testimonials: defaultTestimonials,
      };
    }

    const findSheet = (keywords: string[]) => {
      for (let i = 0; i < doc.sheetCount; i++) {
        const sheet = doc.sheetsByIndex[i];
        const titleLower = sheet.title.toLowerCase();
        if (keywords.some((k) => titleLower === k)) {
          return sheet;
        }
      }
      return null;
    };

    let profile = { ...defaultProfile };
    const profileSheet = findSheet(["profile", "profiling", "bio", "biodata", "about"]);
    if (profileSheet) {
      const rows = await profileSheet.getRows();
      if (rows.length > 0) {
        const row = rows[0];
        const getVal = (keys: string[]) => {
          for (const k of keys) {
            const val = row.get(k);
            if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
          }
          return "";
        };

        profile.name = getVal(["Nama", "nama", "Name", "name"]) || profile.name;
        profile.title = getVal(["title", "Title", "Judul", "Jabatan", "Role"]) || profile.title;
        profile.summary = getVal(["Summary", "summary", "Deskripsi", "Bio", "About", "Summary_Profil"]) || profile.summary;
        profile.email = getVal(["Email", "email", "Kontak"]) || profile.email;
        profile.location = getVal(["lokasi", "Lokasi", "Location", "Alamat"]) || profile.location;
        profile.cvUrl = getVal(["Link_CV", "link_cv", "Link CV", "CV", "Docs_CV"]) || profile.cvUrl;
        profile.avatarUrl = formatImageUrl(getVal(["Foto_URL", "foto_url", "Foto", "Avatar", "Image"])) || profile.avatarUrl;
        profile.githubUrl = getVal(["GitHub", "github", "Github", "Link_Github"]) || profile.githubUrl;
        profile.linkedinUrl = getVal(["LinkedIn", "linkedin", "Linkedin", "Link_Linkedin"]) || profile.linkedinUrl;
        profile.linktreeUrl = getVal(["Linktree", "linktree_link"]) || profile.linktreeUrl;
      }
    }

    let projects = [...defaultProjects];
    const projectSheet = findSheet(["project", "projects", "proyek", "portofolio"]);
    if (projectSheet) {
      const rows = await projectSheet.getRows();
      if (rows.length > 0) {
        projects = rows.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const val = row.get(k);
              if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
            }
            return "";
          };

          const title = getVal(["Judul", "title", "Nama Proyek", "Project"]) || `Project #${idx + 1}`;
          const description = getVal(["Deskripsi", "description", "Keterangan", "Summary"]) || "-";
          const imageUrl =
            formatImageUrl(getVal(["Screenshot_URL", "screenshot", "Image", "Gambar", "Foto"])) ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";
          const link = getVal(["Link", "link", "URL"]) || "#";
          const demoLink = getVal(["Link_Demo", "link_demo", "Demo", "demo", "Live", "live", "Website"]);
          const githubLink = getVal(["Link_Github", "link_github", "Github", "github", "Repo", "repo"]) || link;
          const status = getVal(["Status", "status", "Kondisi"]) || "Completed";
          const techRaw = getVal(["Tech_Stack", "tech_stack", "Tech", "Stack", "Teknologi"]) || "Next.js, TypeScript";
          const techStack = techRaw
            .split(/[,|]/)
            .map((t) => t.trim())
            .filter(Boolean);

          return {
            id: String(idx + 1),
            title,
            description,
            imageUrl,
            link,
            demoLink: demoLink || (link !== "#" ? link : ""),
            githubLink: githubLink !== "#" ? githubLink : "",
            status,
            techStack,
          };
        });
      }
    }

    let experiences = [...defaultExperiences];
    const expSheet = findSheet(["experience", "pengalaman", "karir", "pekerjaan", "job"]);
    if (expSheet) {
      const rows = await expSheet.getRows();
      if (rows.length > 0) {
        experiences = rows.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const val = row.get(k);
              if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
            }
            return "";
          };

          return {
            id: String(idx + 1),
            role: getVal(["title", "Jabatan", "role", "Role", "Posisi"]) || "Developer",
            company: getVal(["Perusahaan", "company", "Company", "Instansi"]) || "Perusahaan",
            period: getVal(["waktu", "Periode", "period", "Tahun"]) || "2023 - Sekarang",
            description: getVal(["Deskripsi", "description", "Tugas", "Keterangan"]) || "-",
            location: getVal(["Lokasi", "location", "Kota"]) || "Indonesia",
          };
        });
      }
    }

    let educations = [...defaultEducations];
    const eduSheet = findSheet(["education", "pendidikan", "studi", "sekolah", "kuliah"]);
    if (eduSheet) {
      const rows = await eduSheet.getRows();
      if (rows.length > 0) {
        educations = rows.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const val = row.get(k);
              if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
            }
            return "";
          };

          return {
            id: String(idx + 1),
            degree: getVal(["Gelar", "degree", "Jurusan", "Program"]) || "Sarjana Komputer",
            institution: getVal(["Institusi", "institution", "Universitas", "Sekolah"]) || "Perguruan Tinggi",
            year: getVal(["tahun", "Tahun", "Year", "Periode"]) || "2019 - 2023",
            description: getVal(["Deskripsi", "description", "Keterangan", "IPK"]) || "",
          };
        });
      }
    }

    let aboutFacts = [...defaultAboutFacts];
    const aboutSheet = findSheet(["about", "funfact", "funfacts", "fakta"]);
    if (aboutSheet) {
      const rows = await aboutSheet.getRows();
      if (rows.length > 0) {
        const loadedFacts = rows
          .map((row) => {
            const val = row.get("Fakta") || row.get("fakta") || row.get("Fact") || row.get("Deskripsi") || row.get("Point") || row.get("Catatan");
            return val ? String(val).trim() : "";
          })
          .filter(Boolean);
        if (loadedFacts.length > 0) aboutFacts = loadedFacts;
      }
    }

    let testimonials = [...defaultTestimonials];
    const testSheet = findSheet(["testimonial", "testimonials", "kesan", "oranglain", "review"]);
    if (testSheet) {
      const rows = await testSheet.getRows();
      if (rows.length > 0) {
        testimonials = rows.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const val = row.get(k);
              if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
            }
            return "";
          };
          return {
            id: String(idx + 1),
            nama: getVal(["Nama", "nama", "Name", "name"]) || `Rekan #${idx + 1}`,
            peran: getVal(["Peran", "peran", "Role", "role", "Jabatan", "Hubungan"]) || "Rekan Kerja",
            kesan: getVal(["Kesan", "kesan", "Testimonial", "Pesan", "Review", "Ulasan"]) || "-",
            avatarUrl: formatImageUrl(getVal(["Avatar", "avatar", "Foto", "Image"])) || "",
          };
        });
      }
    }

    return {
      profile,
      categories,
      projects,
      experiences,
      educations,
      aboutFacts,
      testimonials,
    };
  } catch (err) {
    console.error("Error fetching full portfolio data:", err);
    return {
      profile: defaultProfile,
      categories,
      projects: defaultProjects,
      experiences: defaultExperiences,
      educations: defaultEducations,
      aboutFacts: defaultAboutFacts,
      testimonials: defaultTestimonials,
    };
  }
}
