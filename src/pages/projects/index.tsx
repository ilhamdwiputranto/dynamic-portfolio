import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getFullPortfolioData } from "@/lib/googleSheets";
import { ProjectItem } from "@/types/portfolio";
import { ArrowLeft, ExternalLink, Github, Globe, Search, FolderGit2, ExternalLink as ExternalIcon } from "lucide-react";

interface ProjectsGalleryProps {
  projects: ProjectItem[];
}

export default function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (proj) =>
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const reversedProjects = [...projects].reverse();

  return (
    <>
      <Head>
        <title>Galeri Proyek & Portfolio — Selected Works</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 bg-grid-pattern selection:bg-neutral-800 selection:text-white font-sans">
        <Navbar />

        <main className="relative z-10 flex-grow py-12 px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="text-xs font-mono text-blue-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                <span>{projects.length} Total Projects</span>
              </div>
            </div>

            {/* Banner Section & Search Bar */}
            <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800/80 shadow-2xl flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black text-neutral-300 border border-neutral-800 text-[11px] font-mono">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>PROJECT GALLERY</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Semua Proyek & Portofolio</h1>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Kumpulan seluruh sistem, aplikasi web, dan proyek yang terhubung secara terstruktur dari Google Sheets CMS.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cari proyek atau tech stack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="group rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Thumbnail Link */}
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

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800/80 space-y-2">
                <p className="text-white font-semibold text-sm">Proyek tidak ditemukan</p>
                <p className="text-neutral-400 text-xs">Tidak ada proyek yang cocok dengan kata kunci "{searchTerm}".</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getFullPortfolioData();
  return {
    props: {
      projects: data.projects || [],
    },
  };
};
