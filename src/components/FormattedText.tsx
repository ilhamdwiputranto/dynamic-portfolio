import React from "react";

interface FormattedTextProps {
  text?: string;
  className?: string;
}

/**
 * Komponen untuk memproses teks dinamis dari Google Sheets.
 * Setiap kata/kalimat yang diapit tanda ** (dua bintang) di Google Sheets
 * akan otomatis di-render tebal (bold / <strong>).
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Memisah teks berdasarkan tanda **kata**
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          // Hilangkan tanda ** dan bungkus dengan <strong>
          return (
            <strong key={index} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
};

export default FormattedText;
