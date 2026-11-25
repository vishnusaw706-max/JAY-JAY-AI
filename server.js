import express from "express";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "JAY JAY AI", aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "कृपया अपना सवाल लिखें।" });
  if (message.length > 4000) return res.status(413).json({ error: "सवाल 4000 अक्षरों से छोटा रखें।" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI सेवा अभी configure नहीं है।" });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "आप JAY JAY AI हैं। आसान और स्पष्ट हिंदी में जवाब दें। पढ़ाई और coding में सुरक्षित, उम्र के अनुकूल मदद दें।",
        input: message,
        max_output_tokens: 700
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("AI provider error:", data?.error?.code || response.status);
      return res.status(502).json({ error: "AI सेवा से जवाब नहीं मिला। बाद में कोशिश करें।" });
    }
    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");
    return res.json({ answer: answer || "अभी जवाब उपलब्ध नहीं है।" });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    return res.status(500).json({ error: "सर्वर में समस्या आई।" });
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`JAY JAY AI server listening on ${PORT}`));
