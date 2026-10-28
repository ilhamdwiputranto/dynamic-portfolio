import React, { useState } from "react";
import Link from "next/link";
import { Code2, Download, Bot, User, Briefcase, GraduationCap, FolderGit2, Mail, Menu, X } from "lucide-react";
import { ProfilingData } from "@/types/portfolio";

interface NavbarProps {
  profile?: ProfilingData;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const name = profile?.name || "Ilham Dwi Putranto";
  const cvUrl = profile?.cvUrl || "#";

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-white hover:text-blue-400 transition-colors">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="tracking-tight">{name}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <Link href="/#about" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Profil</span>
          </Link>
          <Link href="/#projects" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Proyek</span>
          </Link>
          <Link href="/#experience" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Pengalaman</span>
          </Link>
          <Link href="/#education" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Pendidikan</span>
          </Link>

          <Link href="/#contact" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Kontak</span>
          </Link>
          <Link
            href="/#ai-assistant"
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <Bot className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>AI Assistant</span>
          </Link>

          {/* ATS CV Download Button */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95">
            <Download className="w-3.5 h-3.5" />
            <span>Download CV ATS</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]">
            <Download className="w-3 h-3" />
            <span>CV ATS</span>
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Toggle Menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-neutral-800/80 space-y-2 pb-2 text-sm font-medium text-neutral-300">
          <Link href="/#about" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Profil & Summary
          </Link>
          <Link href="/#projects" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Proyek Showcase
          </Link>
          <Link href="/#experience" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Pengalaman Kerja
          </Link>
          <Link href="/#education" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Pendidikan
          </Link>
          <Link href="/#skills" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Tech Skills
          </Link>
          <Link href="/#ai-assistant" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg bg-blue-500/10 text-blue-400 font-bold">
            Ask AI Assistant
          </Link>
          <Link href="/#contact" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-neutral-900">
            Leave a Message
          </Link>
        </div>
      )}
    </nav>
  );
};
