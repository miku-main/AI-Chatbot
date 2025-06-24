export default function handler(req, res) {
    if (req.method === 'POST') {
      const { message } = req.body;
      res.status(200).json({ reply: `You said: ${message}` });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }