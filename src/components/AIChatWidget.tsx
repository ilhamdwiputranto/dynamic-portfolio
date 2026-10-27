import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, MessageSquare, X, ChevronDown } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SAMPLE_QUESTIONS = [
  "Siapa Ilham Dwi Putranto?",
  "Apa saja tech skills & keahlian Ilham?",
  "Apa saja pengalaman kerja Ilham?",
  "Lihat daftar proyek buatan Ilham"
];

interface AIChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  name?: string;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onToggle: externalOnToggle,
  name = 'Ilham Dwi Putranto'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleChat = () => {
    if (externalOnToggle) {
      externalOnToggle();
    } else if (externalOnClose && isOpen) {
      externalOnClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Halo! Saya AI Assistant pribadi ${name} (powered by Google AI Studio Gemini API). Silakan tanyakan apa saja tentang profil, latar belakang, skill, pengalaman, atau proyek ${name}!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText?: string) => {
    const query = questionText || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, chatHistory: messages })
      });

      const data = await res.json();
      const aiReply = data.answer || data.reply || 'Maaf, gagal memproses jawaban dari AI.';

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Terjadi kendala koneksi saat menghubungi AI Assistant. Pastikan `GEMINI_API_KEY` telah terpasang di `.env.local`.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-white font-extrabold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-blue-500/30 cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="text-xs sm:text-sm font-bold tracking-wide">Tanya AI</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />}
        </button>
      </div>

      {/* Modal Popup Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[80vh] flex flex-col bg-black/95 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">AI Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">Bertanya seputar profiling & skill {name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([{ sender: 'ai', text: `Sesi chat di-reset. Ada yang ingin ditanyakan seputar ${name}?` }])}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="Reset Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            <span className="text-neutral-500 text-[10px] font-semibold shrink-0 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-blue-400" /> Contoh:
            </span>
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Body */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-black/60 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-[11px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>Membaca data profiling...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-900 border-t border-neutral-800 flex gap-2"
          >
            <input
              type="text"
              placeholder={`Tanya seputar ${name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-grow bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
            >
              <span>Kirim</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
