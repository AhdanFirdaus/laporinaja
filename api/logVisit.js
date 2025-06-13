import supabaseSer from "../supabaseServer.js";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const { error } = await supabaseSer.from('visits').insert([
        {
          ip,
          month,
          created_at: now.toISOString(),
        }
      ]);

      if (error) {
        return res.status(500).json({ message: "Error logging visit" });
      }

      return res.status(200).json({ message: 'Visit logged' });

    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
