export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    const { message } = req.body;
  
    try {
      const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }]
        })
      });
  
      const data = await openrouterRes.json();
      const reply = data.choices?.[0]?.message?.content || "No response from model.";
  
      res.status(200).json({ reply });
  
    } catch (error) {
      console.error("OpenRouter error:", error);
      res.status(500).json({ reply: "Something went wrong with OpenRouter." });
    }
  }
  