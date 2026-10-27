import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCategories } from '@/lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const categories = await getAllCategories();
  return res.status(200).json({ categories });
}