import React, { useState } from 'react';
import { Camera, UserCheck } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils';

interface PhotoPlaceholderProps {
  avatarUrl?: string;
  name?: string;
}

// =========================================================================
// SILAKAN EDIT / GANTI LINK FOTO PROFIL DI BAWAH INI UNTUK MENGUBAH SECARA HARDCODE
// =========================================================================
export const HARDCODED_PHOTO_URL = 'https://lh3.googleusercontent.com/d/1_u8kqgMLUA7aRIvxl4z70gOqWkbyVTSB';

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({ avatarUrl, name = 'Ilham Dwi Putranto' }) => {
  const formattedUrl = formatImageUrl(avatarUrl);
  
  // Prioritaskan avatarUrl dari spreadsheet jika valid, jika kosong/tidak ada gunakan HARDCODED_PHOTO_URL
  const initialUrl = (formattedUrl && formattedUrl.startsWith('http')) 
    ? formattedUrl 
    : HARDCODED_PHOTO_URL;

  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc !== HARDCODED_PHOTO_URL) {
      // Jika gambar dari Drive/Spreadsheet error/hilang, otomatis langsung fallback ke HARDCODED_PHOTO_URL
      setImgSrc(HARDCODED_PHOTO_URL);
    } else {
      // Jika link hardcoded juga bermasalah, tampilkan inisial nama
      setHasError(true);
    }
  };

  return (
    <div className="relative group inline-block">
      {/* Container Frame Foto Profil dengan Border Biru Netral */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-blue-500/40 bg-neutral-900 shadow-2xl flex items-center justify-center">
        {!hasError ? (
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-2xl border border-blue-500/20 mb-1">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="text-[10px] text-neutral-400">Foto Profil</span>
          </div>
        )}

        {/* Change Photo Overlay Guidance */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center p-3">
          <Camera className="w-5 h-5 text-blue-400 mb-1" />
          <span className="text-[10px] font-medium text-neutral-200 leading-tight">Ubah foto di Sheet 'Profiling' atau hardcode link di PhotoPlaceholder.tsx</span>
        </div>
      </div>

      {/* Verified Badge Icon */}
      <div className="absolute bottom-1 right-1 p-2 rounded-full bg-black border border-neutral-800 text-blue-400 shadow-lg" title="Verified Profile">
        <UserCheck className="w-4 h-4" />
      </div>
    </div>
  );
};
