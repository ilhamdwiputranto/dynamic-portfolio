import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProjectById } from "@/lib/googleSheets";
import { ProjectItem } from "@/types/portfolio";
import { ArrowLeft, ExternalLink, Github, Globe } from "lucide-react";

interface ProjectDetailPageProps {
  project: ProjectItem | null;
}

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  if (!project) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 px-6 max-w-md mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Proyek Tidak Ditemukan</h1>
          <p className="text-neutral-400 text-sm">Proyek yang Anda cari tidak tersedia atau ID tidak valid.</p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${project.title} — Detail Proyek`}</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 bg-grid-pattern selection:bg-neutral-800 selection:text-white font-sans">
        <Navbar />

        <main className="relative z-10 flex-grow py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Tombol Kembali */}
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portfolio</span>
            </Link>

            {/* Header & Gambar Proyek */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-6">
              <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden border border-neutral-800">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/90 border border-neutral-800 text-xs font-mono text-blue-400">
                  {project.status}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{project.title}</h1>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-black text-neutral-200 text-xs font-mono border border-neutral-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tautan Proyek */}
              <div className="pt-4 flex flex-wrap gap-3">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm">
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-semibold text-xs flex items-center gap-2 transition-all">
                    <Github className="w-4 h-4 text-neutral-400" />
                    <span>Repository GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (typeof id !== "string") {
    return { notFound: true };
  }

  const project = await getProjectById(id);

  if (!project) {
    return { notFound: true };
  }

  return {
    props: { project },
  };
};
