import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCategoryData } from "@/lib/googleSheets";
import { SkillCategory, SkillItem } from "@/types/portfolio";
import { FormattedText } from "@/components/FormattedText";
import { ArrowLeft, ExternalLink, FileText, Github, Search, Code2, Filter } from "lucide-react";

interface SkillDetailPageProps {
  category: SkillCategory | null;
  items: SkillItem[];
}

export default function SkillDetailPage({ category, items }: SkillDetailPageProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Semua");

  if (!category) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 px-6 max-w-md mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-white">Kategori Tidak Ditemukan</h1>
          <p className="text-neutral-400 text-sm">Sheet atau kategori yang Anda cari tidak tersedia di spreadsheet.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Dapatkan daftar unik sub-kategori yang ada di data sheet
  const subCategories = ["Semua", ...Array.from(new Set(items.map((i) => i.subCategory || "Umum")))];

  // Filter berdasarkan kata kunci pencarian DAN tab sub-kategori yang dipilih
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.namaFungsi.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.catatan.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(filterQuery.toLowerCase()));

    const matchesSubCategory = selectedSubCategory === "Semua" || item.subCategory === selectedSubCategory;

    return matchesSearch && matchesSubCategory;
  });

  return (
    <>
      <Head>
        <title>{`${category?.title || "Keahlian"} — Technical Documentation`}</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 bg-grid-pattern selection:bg-neutral-800 selection:text-white font-sans">
        <Navbar />

        <main className="relative z-10 flex-grow py-12 px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Navigation & Status */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Live Google Sheet Sync</span>
              </div>
            </div>

            {/* Category Banner Card */}
            <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800/80 shadow-2xl flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black text-neutral-300 border border-neutral-800 text-[11px] font-mono">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>MODUL DOKUMENTASI</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{category.title}</h1>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{category.description}</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cari fungsi / kata kunci..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* TAB FILTER SUB-KATEGORI (HTML / CSS / JS, DLL) */}
            {subCategories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 pr-2 border-r border-neutral-800">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Kategori:</span>
                </div>
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border whitespace-nowrap ${
                      selectedSubCategory === sub
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 font-semibold"
                        : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
                    }`}>
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {/* Module Table Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Daftar Modul & Praktik ({filteredItems.length})</span>
                </h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40 shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-[11px] font-mono uppercase tracking-wider">
                      <th className="py-3.5 px-6 w-1/5">Nama Fungsi / Modul</th>
                      <th className="py-3.5 px-6 w-1/6">Kategori</th>
                      <th className="py-3.5 px-6 w-2/5">Kesan & Evaluasi</th>
                      <th className="py-3.5 px-6 w-1/5 text-right">Repository GitHub</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-xs text-neutral-300">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/80 transition-colors group">
                        <td className="py-4 px-6 font-bold text-white group-hover:text-blue-400 transition-colors">{item.namaFungsi}</td>
                        <td className="py-4 px-6 font-mono text-[11px]">
                          <span className="px-2.5 py-1 rounded-md bg-black text-blue-400 border border-neutral-800">
                            {item.subCategory || "Umum"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-neutral-300 leading-relaxed">
                          <FormattedText text={item.catatan} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          {item.linkGithub && item.linkGithub !== "#" ? (
                            <a
                              href={item.linkGithub}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-medium transition-all">
                              <Github className="w-3.5 h-3.5" />
                              <span>View Code</span>
                              <ExternalLink className="w-3 h-3 text-neutral-500" />
                            </a>
                          ) : (
                            <span className="text-xs text-neutral-500 font-mono italic">No Repository</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-white text-sm">{item.namaFungsi}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-blue-400 border border-neutral-800">
                        {item.subCategory || "Umum"}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-300 leading-relaxed bg-black p-3 rounded-xl border border-neutral-800">
                      <FormattedText text={item.catatan} />
                    </div>
                    {item.linkGithub && item.linkGithub !== "#" && (
                      <a
                        href={item.linkGithub}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 pt-1">
                        <Github className="w-4 h-4" />
                        <span>Lihat Kode di GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800/80">
                  <p className="text-neutral-400 text-xs sm:text-sm">Tidak ada fungsi yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const { category, items } = await getCategoryData(slug);

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      items,
    },
  };
};
