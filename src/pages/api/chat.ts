import type { NextApiRequest, NextApiResponse } from 'next';
import { getFullPortfolioData } from '@/lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(200).json({ answer: 'Halo! Ada yang bisa saya bantu seputar profil Ilham Dwi Putranto?' });
  }

  try {
    const data = await getFullPortfolioData();
    const { profile, categories, projects, experiences, educations, aboutFacts = [], testimonials = [] } = data;

    let apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ''
    ).trim();

    if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
      apiKey = apiKey.slice(1, -1).trim();
    }

    const queryLower = message.toLowerCase().trim();

    const contextPrompt = `
Anda adalah AI Assistant pribadi resmi untuk ${profile.name}. Jawablah pertanyaan pengunjung web portofolio dengan ramah, komunikatif, dan ringkas dalam Bahasa Indonesia berdasarkan data berikut:

[DATA PROFIL ${profile.name.toUpperCase()}]
- Nama Lengkap: ${profile.name}
- Judul / Role: ${profile.title}
- Ringkasan Profil: ${profile.summary}
- Email: ${profile.email}
- Lokasi: ${profile.location}
- Link CV ATS: ${profile.cvUrl}
- GitHub: ${profile.githubUrl}
- LinkedIn: ${profile.linkedinUrl}

[FAKTA UNIK & DIRI ${profile.name.toUpperCase()} (DARI SHEET ABOUT / FUNFACT)]
${aboutFacts.length > 0 ? aboutFacts.map((f, i) => `${i + 1}. ${f}`).join('\n') : '- Belum ada fakta unik terdaftar.'}

[PENGALAMAN KERJA & KARIR]
${experiences.map(e => `- ${e.role} di ${e.company} (${e.period}): ${e.description}`).join('\n')}

[PENDIDIKAN FORMAL]
${educations.map(e => `- ${e.degree} di ${e.institution} (${e.year}): ${e.description}`).join('\n')}

[DAFTAR PROYEK SHOWCASE]
${projects.map(p => `- Proyek "${p.title}" [Status: ${p.status}]: ${p.description}. Tech Stack: ${p.techStack.join(', ')}`).join('\n')}

[KATEGORI SKILL SPREADSHEET]
${categories.map(c => `- ${c.title}: ${c.itemCount} fungsi terdaftar. (${c.description})`).join('\n')}

[KESAN ORANG LAIN / TESTIMONIAL]
${testimonials.map(t => `- ${t.nama} (${t.peran}): "${t.kesan}"`).join('\n')}

Instruksi Tambahan:
- Jika pertanyaan menanyakan hal personal (seperti anak ke berapa, hobi, fakta unik), jawab berdasarkan data Sheet ABOUT / FUNFACT di atas.
- Jika data spesifik tidak ditemukan di dataset, jawablah secara sopan menggunakan data profil umum ${profile.name}.
- Pertanyaan Pengunjung: "${message}"
`;

    // Smart Fallback Generator when API Key is not configured or Gemini REST call fails
    const generateSmartFallback = () => {
      let reply = `Halo! Saya AI Assistant pribadi **${profile.name}**.\n\n`;

      if (
        queryLower.includes('anak') ||
        queryLower.includes('fakta') ||
        queryLower.includes('fun') ||
        queryLower.includes('hobi') ||
        queryLower.includes('ke berapa') ||
        queryLower.includes('suka') ||
        queryLower.includes('tentang') ||
        queryLower.includes('personal')
      ) {
        reply += `**Fakta Unik & Tentang ${profile.name} (Sheet 'About'):**\n`;
        if (aboutFacts.length > 0) {
          reply += aboutFacts.map(f => `• ${f}`).join('\n');
        } else {
          reply += `• ${profile.name} adalah ${profile.title}.\n• Sangat menyukai otomatisasi workflow & Next.js web development.`;
        }
      } else if (
        queryLower.includes('siapa') ||
        queryLower.includes('profil') ||
        queryLower.includes('bio') ||
        queryLower.includes('ilham') ||
        queryLower.includes('deskripsi')
      ) {
        reply += `**${profile.name}** adalah ${profile.title}.\n\n${profile.summary}\n\n📍 **Lokasi:** ${profile.location}\n✉️ **Email:** ${profile.email}\n\n`;
        if (aboutFacts.length > 0) {
          reply += `**Fakta Singkat:**\n` + aboutFacts.slice(0, 2).map(f => `• ${f}`).join('\n');
        }
      } else if (
        queryLower.includes('skill') ||
        queryLower.includes('keahlian') ||
        queryLower.includes('bahasa') ||
        queryLower.includes('tech') ||
        queryLower.includes('modul') ||
        queryLower.includes('sintaks')
      ) {
        reply += `**Keahlian Teknis & Modul Spreadsheet ${profile.name}:**\n` + categories.map(c => `• **${c.title}**: ${c.itemCount} modul terdaftar`).join('\n');
      } else if (
        queryLower.includes('pengalaman') ||
        queryLower.includes('kerja') ||
        queryLower.includes('karir') ||
        queryLower.includes('perusahaan') ||
        queryLower.includes('job')
      ) {
        reply += `**Pengalaman Kerja & Karir ${profile.name}:**\n` + experiences.map(e => `• **${e.role}** di ${e.company} (${e.period})\n  _${e.description}_`).join('\n\n');
      } else if (
        queryLower.includes('proyek') ||
        queryLower.includes('project') ||
        queryLower.includes('portfolio') ||
        queryLower.includes('karya') ||
        queryLower.includes('showcase')
      ) {
        reply += `**Proyek Showcase ${profile.name}:**\n` + projects.map(p => `• **${p.title}** [Status: ${p.status}]: ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}`).join('\n\n');
      } else if (
        queryLower.includes('pendidikan') ||
        queryLower.includes('kuliah') ||
        queryLower.includes('gelar') ||
        queryLower.includes('sekolah') ||
        queryLower.includes('sarjana')
      ) {
        reply += `**Latar Belakang Pendidikan ${profile.name}:**\n` + educations.map(e => `• **${e.degree}** di ${e.institution} (${e.year})\n  _${e.description}_`).join('\n\n');
      } else if (
        queryLower.includes('kesan') ||
        queryLower.includes('orang') ||
        queryLower.includes('testimoni') ||
        queryLower.includes('pendapat') ||
        queryLower.includes('rekan')
      ) {
        reply += `**Bagaimana ${profile.name} Menurut Orang Lain:**\n` + testimonials.map(t => `• **${t.nama}** (${t.peran}): "${t.kesan}"`).join('\n');
      } else if (
        queryLower.includes('cv') ||
        queryLower.includes('resume') ||
        queryLower.includes('kontak') ||
        queryLower.includes('download')
      ) {
        reply += `**Kontak & CV ATS ${profile.name}:**\n• ✉️ Email: ${profile.email}\n• 📄 Link CV ATS: ${profile.cvUrl}\n• 🐙 GitHub: ${profile.githubUrl}\n• 💼 LinkedIn: ${profile.linkedinUrl}`;
      } else {
        reply += `${profile.name} adalah ${profile.title}.\n\n${profile.summary}\n\n`;
        if (aboutFacts.length > 0) {
          reply += `**Fakta Singkat:**\n` + aboutFacts.map(f => `• ${f}`).join('\n');
        }
      }

      return reply;
    };

    if (!apiKey) {
      return res.status(200).json({ answer: generateSmartFallback() });
    }

    // Modern Gemini 3.x models officially specified by Google AI Studio
    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
    let aiAnswer = '';

    const domain = 'generativelanguage.googleapis.com';

    for (const model of models) {
      let attempts = 0;
      const maxAttempts = 2; // Retry once if 503 high demand occurs

      while (attempts < maxAttempts && !aiAnswer) {
        attempts++;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout per request

          const endpoint = `https://${domain}/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const geminiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: contextPrompt }]
                }
              ]
            })
          });

          clearTimeout(timeoutId);

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              aiAnswer = replyText;
              console.log(`[Gemini API Success] Model: ${model}`);
              break;
            }
          } else {
            const errText = await geminiRes.text();
            console.error(`[Gemini API Error] Model: ${model} (Attempt ${attempts}), Status: ${geminiRes.status}, Body: ${errText}`);

            // If status is 503 (High Demand), wait 500ms before quick retry
            if (geminiRes.status === 503 && attempts < maxAttempts) {
              await new Promise(r => setTimeout(r, 500));
            } else {
              break; // move to next model if 404 or other non-retryable error
            }
          }
        } catch (err: any) {
          if (err?.name === 'AbortError') {
            console.error(`[Gemini API Timeout] Model ${model} timed out after 7s`);
          } else {
            console.error(`[Gemini API Exception - ${model}]:`, err);
          }
          break;
        }
      }

      if (aiAnswer) break;
    }

    if (!aiAnswer) {
      aiAnswer = generateSmartFallback();
    }

    return res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    return res.status(200).json({
      answer: "Halo! Saya AI Assistant pribadi Ilham Dwi Putranto. Ilham adalah Full-Stack Web Developer & Automation Specialist yang berpengalaman dalam Next.js, React, TypeScript, dan Google Cloud APIs."
    });
  }
}
