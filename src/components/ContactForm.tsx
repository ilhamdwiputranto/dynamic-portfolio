import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactForm: React.FC<{ email?: string }> = ({ email = 'ilhamdwiputranto@gmail.com' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFeedback('Pesan Anda berhasil terkirim ke Ilham Dwi Putranto! Terima kasih telah menghubungi.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.message || 'Gagal mengirim pesan.');
      }
    } catch (err) {
      setStatus('error');
      setFeedback('Terjadi kesalahan jaringan saat mengirim pesan.');
    }
  };

  return (
    <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800/80 shadow-xl space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-950 text-blue-400 border border-neutral-800 text-[11px] font-mono">
          <Mail className="w-3.5 h-3.5 text-blue-400" />
          <span>FORM KONTAK & PESAN</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Tinggalkan Pesan untuk Ilham</h3>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Ingin mendiskusikan peluang kerja, proyek freelance, atau sekadar berjejaring? Isikan pesan Anda di bawah ini.
        </p>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{feedback}</div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{feedback}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Nama Pengirim *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Email / Kontak *</label>
            <input
              type="email"
              required
              placeholder="budi@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300">Subjek</label>
          <input
            type="text"
            placeholder="Topik / Perihal pesan"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300">Isi Pesan *</label>
          <textarea
            required
            rows={4}
            placeholder="Tuliskan detail pesan Anda di sini..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
        >
          <span>{status === 'loading' ? 'Mengirim Pesan...' : 'Kirim Pesan'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
