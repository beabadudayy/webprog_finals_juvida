import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/guestbook
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST /api/guestbook
  if (req.method === 'POST') {
    const { name, message } = req.body as { name: string; message: string };
    const { data, error } = await supabase
      .from('guestbook')
      .insert([{ name, message }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // DELETE /api/guestbook/:id — id extracted from URL path
  if (req.method === 'DELETE') {
    const parts = (req.url ?? '').split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const { error } = await supabase.from('guestbook').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
