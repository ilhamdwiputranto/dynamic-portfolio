import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpreadsheet } from '@/lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !message) {
    return res.status(400).json({ success: false, message: 'Nama dan pesan wajib diisi.' });
  }

  try {
    const doc = await getSpreadsheet();
    if (!doc) {
      console.warn('[Contact API] Google Sheets doc is null. Check .env.local credentials.');
      return res.status(200).json({
        success: true,
        message: 'Pesan diterima! (Catatan: Hubungkan .env.local untuk menyimpan ke spreadsheet live).'
      });
    }

    let msgSheet = null;
    for (let i = 0; i < doc.sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      const titleLower = sheet.title.toLowerCase().trim();
      if (
        titleLower.includes('message') ||
        titleLower.includes('kontak') ||
        titleLower.includes('contact') ||
        titleLower.includes('pesan')
      ) {
        msgSheet = sheet;
        break;
      }
    }

    const headers = ['Waktu', 'Nama', 'Email', 'Subjek', 'Pesan'];

    if (!msgSheet) {
      msgSheet = await doc.addSheet({
        title: 'Messages',
        headerValues: headers
      });
    } else {
      try {
        await msgSheet.loadHeaderRow();
      } catch (e) {
        await msgSheet.setHeaderRow(headers);
      }
    }

    if (!msgSheet.headerValues || msgSheet.headerValues.length === 0) {
      await msgSheet.setHeaderRow(headers);
    }

    await msgSheet.addRow({
      Waktu: new Date().toLocaleString('id-ID'),
      Nama: String(name).trim(),
      Email: email ? String(email).trim() : '-',
      Subjek: subject ? String(subject).trim() : '-',
      Pesan: String(message).trim()
    });

    console.log('[Contact API] Successfully added message row to Google Sheets!');

    return res.status(200).json({
      success: true,
      message: 'Pesan Anda berhasil diterima & tersimpan di Google Spreadsheet! Terima kasih telah menghubungi.'
    });
  } catch (err: any) {
    console.error('[Contact API Error]:', err?.message || err);
    return res.status(200).json({
      success: true,
      message: 'Pesan Anda telah berhasil diproses.'
    });
  }
}
