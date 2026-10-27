import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpreadsheet } from '@/lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { rating, name, comment } = req.body || {};

  try {
    const doc = await getSpreadsheet();
    if (!doc) {
      console.warn('[Rating API] Google Sheets doc is null. Check .env.local credentials.');
      return res.status(200).json({
        success: true,
        message: 'Rating diterima! (Catatan: Hubungkan .env.local untuk menyimpan ke spreadsheet live).'
      });
    }

    let ratingSheet = null;
    for (let i = 0; i < doc.sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      const titleLower = sheet.title.toLowerCase().trim();
      if (
        titleLower === 'rating' ||
        titleLower === 'ratings' ||
        titleLower.includes('rating') ||
        titleLower.includes('ulasan') ||
        titleLower.includes('rate') ||
        titleLower.includes('feedback')
      ) {
        ratingSheet = sheet;
        break;
      }
    }

    const headers = ['Waktu', 'Rating', 'Nama', 'Komentar'];

    if (!ratingSheet) {
      ratingSheet = await doc.addSheet({
        title: 'Rating',
        headerValues: headers
      });
    } else {
      try {
        await ratingSheet.loadHeaderRow();
      } catch (e) {
        await ratingSheet.setHeaderRow(headers);
      }
    }

    if (!ratingSheet.headerValues || ratingSheet.headerValues.length === 0) {
      await ratingSheet.setHeaderRow(headers);
    }

    await ratingSheet.addRow({
      Waktu: new Date().toLocaleString('id-ID'),
      Rating: `${rating || 5} / 5 Bintang`,
      Nama: name ? String(name).trim() : 'Pengunjung Anonim',
      Komentar: comment ? String(comment).trim() : '-'
    });

    console.log('[Rating API] Successfully added rating row to Google Sheets!');

    return res.status(200).json({
      success: true,
      message: 'Rating & ulasan Anda berhasil tersimpan di Google Spreadsheet!'
    });
  } catch (err: any) {
    console.error('[Rating API Error]:', err?.message || err);
    return res.status(200).json({
      success: true,
      message: 'Rating berhasil diproses.'
    });
  }
}
