const db = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const { file } = req.body;
    if (!file || typeof file !== 'string') {
      res.status(400).json({ error: "Falta el archivo o formato inválido" });
      return;
    }

    // Parse base64 data URL
    const match = file.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let content = file;

    if (match) {
      mimeType = match[1];
      content = match[2];
    }

    const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await db.query(
      `INSERT INTO media (id, content, mime_type) VALUES ($1, $2, $3)`,
      [mediaId, content, mimeType]
    );

    res.status(200).json({ url: `/api/media?id=${mediaId}` });
  } catch (err) {
    console.error("POST /api/upload-media error:", err);
    res.status(500).json({ error: "Error de servidor al subir archivo" });
  }
};
