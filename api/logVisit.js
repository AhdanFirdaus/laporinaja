// /api/logVisit.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = new Date();

    // Store in your database, for example:
    // await db.insertVisit({ route: '/home', ip, timestamp: now });

    console.log(`Visit logged to /home from IP: ${ip} at ${now}`);
    return res.status(200).json({ message: 'Visit logged' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
