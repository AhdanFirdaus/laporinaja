export default function handler(req, res) {
  console.log("✅ API route hit: /api/hello");
  res.status(200).json({ message: "Hello from the backend!" });
}