import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // ← 追加

const app = express();
app.use(cors()); // ← 追加

const PORT = process.env.PORT || 3001;

app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URLが指定されていません");

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("画像取得エラー:", err);
    res.status(500).send("画像取得に失敗しました");
  }
});

app.listen(PORT, () => {
  console.log(`✅ 画像プロキシサーバー起動: http://localhost:${PORT}`);
});
