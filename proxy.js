import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URLが指定されていません");

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.instagram.com/' // Instagram対策
      }
    });

    if (!response.ok) {
      throw new Error(`❌ 画像取得失敗: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store"); // キャッシュ回避（iOSで画像が古くなる問題）

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ 画像取得エラー:", err.message);
    res.status(500).send("画像取得に失敗しました");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 画像プロキシサーバー起動: http://localhost:${PORT}`);
});