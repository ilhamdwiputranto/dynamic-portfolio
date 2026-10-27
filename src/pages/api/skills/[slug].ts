import type { NextApiRequest, NextApiResponse } from 'next';
import { getCategoryData } from '@/lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid Slug' });
  }

  const data = await getCategoryData(slug);
  if (!data.category) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }

  return res.status(200).json(data);
}