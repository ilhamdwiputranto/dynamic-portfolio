import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { AIChatWidget } from "@/components/AIChatWidget";
import { RatingWidget } from "@/components/RatingWidget";
import { ContactForm } from "@/components/ContactForm";
import { getFullPortfolioData } from "@/lib/googleSheets";
import { PortfolioFullData } from "@/types/portfolio";
import {
  ArrowRight,
  Code2,
  Github,
  Linkedin,
  Link2,
  Mail,
  MapPin,
  Download,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Search,
  Bot,
  Terminal,
  Quote,
  Smile,
  Sparkles,
  Globe,
} from "lucide-react";

export default function Home({ profile, categories, projects, experiences, educations, aboutFacts = [], testimonials = [] }: PortfolioFullData) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalSkillModules = categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0);

  return (
    <>
      <Head>
        <title>{`${profile?.name || "Ilham Dwi Putranto"} — Developer Portfolio`}</title>
        <meta name="description" content={`Portofolio Pengembang Web ${profile.name} — Full-Stack Developer`} />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 bg-grid-pattern selection:bg-neutral-800 selection:text-white">
        <Navbar profile={profile} />

        <main className="relative z-10 flex-grow">
          {/* 1. HERO SECTION */}
          <section className="relative pt-16 pb-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
              {/* Profile Photo Placeholder */}
              <div className="shrink-0">
                <PhotoPlaceholder avatarUrl={profile.avatarUrl} name={profile.name} />
              </div>

              {/* Intro Text & Portfolio Focus */}
              <div className="space-y-5 flex-grow">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Dynamic Sheet CMS Live</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                    <span>Gemini AI Connected</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                  <p className="text-lg sm:text-2xl font-semibold text-blue-400">{profile.title}</p>
                </div>

                {/* Deskripsi Khusus Web Portofolio */}
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Selamat datang di portofolio saya <span className="text-white font-medium">{profile.name}</span>. Web ini terintegrasi secara
                  real-time dengan Google Spreadsheet sebagai Headless CMS & dilengkapi AI Assistant terkontekstual.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-neutral-400 pt-1">
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      {profile.email}
                    </span>
                  )}
                </div>

                {/* Hero Action Buttons */}
                <div className="pt-2 flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95">
                    <Download className="w-4 h-4" />
                    <span>Download CV ATS</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span>Ask AI Assistant</span>
                  </button>

                  <a
                    href="#contact"
                    className="px-5 py-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium text-xs sm:text-sm transition-all">
                    <span>Contact Me</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. SECTION ABOUT & PERSONAL SUMMARY */}
          <section id="about" className="py-16 px-6 border-b border-neutral-800/80">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-800/80 pb-6">
                <div>
                  <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 01. PROFILE SUMMARY</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Profil & Background</h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Ringkasan kualifikasi teknis dan latar belakang profesional {profile.name}.
                  </p>
                </div>

                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-800 transition-colors">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Docs CV ATS</span>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-blue-400" />
                    <span>Tentang {profile.name}</span>
                  </h3>

                  {/* Summary Profil Asli Terhubung Langsung dari Google Sheets */}
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">{profile.summary}</p>

                  {/* Facts / About Checklist */}
                  {aboutFacts.length > 0 && (
                    <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Smile className="w-4 h-4 text-blue-400" />
                        <span>Fakta Unik & Catatan Personal</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {aboutFacts.map((fact, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-black border border-neutral-800/80 flex items-start gap-2.5 text-neutral-300">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recruiter Quick Card */}
                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl space-y-6">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">Quick Contact</h4>
                    <p className="text-xs text-neutral-400">Siap berkontribusi untuk proyek/tim Anda</p>
                  </div>

                  <div className="space-y-2.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black border border-neutral-800 font-mono text-[11px]">
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>

                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span className="flex items-center gap-2">
                          <Github className="w-4 h-4 text-neutral-300" />
                          <span>GitHub Profile</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    )}

                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-neutral-300" />
                          <span>LinkedIn Profile</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    )}

                    {profile.linktreeUrl && (
                      <a
                        href={profile.linktreeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
                        <span className="flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-neutral-300" />
                          <span>Linktree Profile</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    )}
                  </div>

                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                    <span>Download CV ATS</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3. SECTION PROJECT SHOWCASE */}
          <section id="projects" className="py-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-800/80 pb-6">
                <div>
                  <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 02. SELECTED WORKS</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Project Showcase</h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">Daftar karya & sistem yang dibangun oleh {profile.name}.</p>
                </div>
                <span className="text-xs text-neutral-500 font-mono">{projects.length} Projects Listed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mengambil hanya 6 proyek pertama */}
                {projects.slice(0, 6).map((proj) => (
                  <div
                    key={proj.id}
                    className="group rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 overflow-hidden shadow-xl flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Thumbnail Gambar dengan Link */}
                      <Link
                        href={`/projects/${proj.id}`}
                        className="block relative h-48 w-full bg-black overflow-hidden border-b border-neutral-800 cursor-pointer">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/90 border border-neutral-800 text-[10px] font-mono text-blue-400">
                          {proj.status}
                        </div>
                      </Link>

                      <div className="p-6 space-y-3">
                        <Link href={`/projects/${proj.id}`}>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">{proj.title}</h3>
                        </Link>
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">{proj.description}</p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-black text-neutral-300 text-[10px] font-mono border border-neutral-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex flex-wrap items-center gap-2.5">
                      {proj.demoLink && proj.demoLink !== "#" ? (
                        <a
                          href={proj.demoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 min-w-[120px] py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
                          <Globe className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      ) : null}

                      {(proj.githubLink && proj.githubLink !== "#") || (!proj.demoLink && proj.link && proj.link !== "#") ? (
                        <a
                          href={proj.githubLink || proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 min-w-[120px] py-2 rounded-xl bg-black hover:bg-neutral-800 text-neutral-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-all border border-neutral-800">
                          <Github className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOMBOL "LIHAT SEMUA PROYEK" */}
              {projects.length > 6 && (
                <div className="flex justify-center pt-8">
                  <Link
                    href="/projects"
                    className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md group">
                    <span>Lihat Semua Proyek ({projects.length})</span>
                    <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* 4. SECTION TECH SKILLS & DOKUMENTASI MODUL */}
          <section id="skills" className="py-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-800/80 pb-6">
                <div>
                  <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 03. SKILLS & MODULES</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tech Skills & Documentation</h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Dokumentasi {totalSkillModules} fungsi & modul teknis terdaftar langsung dari Google Sheets.
                  </p>
                </div>

                {/* Quick Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search category / skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Skill Cards List */}
              <div className="space-y-3">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/skills/${category.slug}`}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                      <div className="p-3 rounded-xl bg-black text-blue-400 border border-neutral-800 shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{category.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-black text-blue-400 border border-neutral-800 text-[10px] font-mono">
                            {category.itemCount} Modul
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl whitespace-pre-line">
                          {category.description || `Dokumentasi fungsi & praktik untuk ${category.title}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white shrink-0 self-end sm:self-center">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 5. SECTION PENGALAMAN KERJA (EXPERIENCE) */}
          <section id="experience" className="py-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="border-b border-neutral-800/80 pb-6">
                <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 04. EXPERIENCE</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Experiences</h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">Rekam jejak karir {profile.name}.</p>
              </div>

              <div className="relative border-l border-neutral-800 ml-4 sm:ml-6 space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 sm:pl-8 group">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-black border border-blue-400"></div>
                    <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="text-base font-bold text-white">{exp.role}</h3>
                        <span className="px-2.5 py-0.5 rounded-md bg-black text-neutral-400 border border-neutral-800 text-[11px] font-mono w-max">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-blue-400">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed pt-1 whitespace-pre-line">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. SECTION PENDIDIKAN (EDUCATION) */}
          <section id="education" className="py-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="border-b border-neutral-800/80 pb-6">
                <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 05. EDUCATION</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Education</h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">Pendidikan formal dan kualifikasi akademis {profile.name}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educations.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-black text-blue-400 border border-neutral-800">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">{edu.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                    <p className="text-xs font-medium text-blue-400">{edu.institution}</p>
                    {edu.description && <p className="text-xs text-neutral-400 leading-relaxed pt-1 whitespace-pre-line">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. SECTION TESTIMONIALS */}
          <section id="testimonials" className="py-20 px-6 border-b border-neutral-800/80">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="border-b border-neutral-800/80 pb-6">
                <div className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-1">// 06. TESTIMONIALS</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Recommendations & Feedback</h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">Kesan dan ulasan nyata dari rekan dan mitra kerja.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((item) => (
                  <div key={item.id} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-4 relative">
                    <Quote className="w-6 h-6 text-neutral-700 absolute top-6 right-6" />

                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic relative z-10">"{item.kesan}"</p>

                    <div className="flex items-center gap-3 pt-2 border-t border-neutral-800/80">
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.nama} className="w-9 h-9 rounded-full object-cover border border-neutral-800" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-black text-neutral-300 border border-neutral-800 flex items-center justify-center font-bold text-xs">
                          {item.nama.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-xs">{item.nama}</h4>
                        <p className="text-[11px] text-neutral-400">{item.peran}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. SECTION AI CALLOUT CARD */}
          <section id="ai-assistant" className="py-16 px-6 border-b border-neutral-800/80 bg-black/60">
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black text-blue-400 border border-neutral-800 text-[10px] font-mono">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  <span>INTERACTIVE AI ASSISTANT</span>
                </div>
                <h3 className="text-lg font-bold text-white">Ingin Bertanya Lebih Lanjut?</h3>
                <p className="text-xs text-neutral-400">
                  Gunakan AI Assistant terintegrasi untuk mengajukan pertanyaan seputar latar belakang & keahlian {profile.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buka AI Chat</span>
              </button>
            </div>
          </section>

          {/* 9. SECTION FORM KONTAK */}
          <section id="contact" className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <ContactForm email={profile.email} />
            </div>
          </section>
        </main>

        {/* Floating AI Chat Widget Modal Popup */}
        <AIChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} onClose={() => setIsChatOpen(false)} name={profile.name} />

        {/* Floating Rating Widget Modal Popup */}
        <RatingWidget />

        <Footer profile={profile} />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getFullPortfolioData();
  return {
    props: data,
  };
}
