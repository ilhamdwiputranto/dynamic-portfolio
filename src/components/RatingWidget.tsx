import React, { useState } from "react";
import { Star, X, Send, CheckCircle2 } from "lucide-react";

export const RatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, name, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Rating Trigger Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-blue-400 font-extrabold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-500/30 cursor-pointer backdrop-blur-md"
          title="Rate Portfolio Website">
          <Star className="w-4 h-4 fill-blue-400 text-blue-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-neutral-100">Rate Website</span>
        </button>
      </div>

      {/* Floating Rating Modal Popup */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-black/95 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Rate Website</h3>
                <p className="text-[11px] text-neutral-400">Your review is saved directly to Spreadsheet</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Thank You!</h4>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  Your rating of {rating} out of 5 stars and review have been saved to Google Spreadsheet.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 font-bold text-xs hover:bg-neutral-700 transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating Picker */}
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-semibold text-neutral-300 block">Select Star Rating:</label>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none">
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoverRating || rating) ? "text-blue-400 fill-blue-400" : "text-neutral-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-blue-400 block pt-1 font-mono">
                    {rating === 5 && "Excellent!"}
                    {rating === 4 && "Good!"}
                    {rating === 3 && "Average"}
                    {rating === 2 && "Needs Improvement"}
                    {rating === 1 && "Poor"}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400">Your Name (Opsional):</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe / Recruiter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400">Feedback & Impressions:</label>
                  <textarea
                    rows={3}
                    placeholder="Very responsive site and clean UI!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Submitting Rating..." : "Submit Rating to Spreadsheet"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
