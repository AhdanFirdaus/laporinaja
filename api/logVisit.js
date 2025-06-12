// /api/logVisit.js
import supabaseSer from "../supabaseServer.js"; // Add .js to be explicit

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get IP address (basic check)
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

      // Get current month in YYYY-MM format
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Insert into Supabase
      const { error } = await supabaseSer.from('visits').insert([
        {
          ip,
          month,
          created_at: now.toISOString(), // optional since Supabase defaults to now()
        }
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ message: "Error logging visit" });
      }

      console.log(`Visit logged to /home from IP: ${ip} at ${now}`);
      return res.status(200).json({ message: 'Visit logged' });

    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
