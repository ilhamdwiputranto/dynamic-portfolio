import React from 'react';
import { ProfilingData } from '@/types/portfolio';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

interface FooterProps {
  profile?: ProfilingData;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const name = profile?.name || 'Ilham Dwi Putranto';
  const githubUrl = profile?.githubUrl || '#';
  const linkedinUrl = profile?.linkedinUrl || '#';
  const email = profile?.email || 'ilhamdwiputranto@gmail.com';

  return (
    <footer className="border-t border-neutral-800/80 bg-black py-10 px-6 text-neutral-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>{name} — Dynamic Portfolio</span>
          </div>
          <p className="text-neutral-500 font-mono text-[11px]">
            Engineered with Next.js, TypeScript, Google Sheets API & Gemini AI Studio
          </p>
        </div>

        <div className="flex items-center gap-3 text-neutral-400">
          {githubUrl && githubUrl !== '#' && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {linkedinUrl && linkedinUrl !== '#' && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          <a
            href={`mailto:${email}`}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        <p className="text-neutral-500 text-[11px] font-mono text-center md:text-right">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
