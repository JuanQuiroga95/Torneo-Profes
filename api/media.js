const db = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  if (!id) {
    res.status(400).send("Falta el parámetro id");
    return;
  }

  try {
    const result = await db.query("SELECT content, mime_type FROM media WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.setHeader('Content-Type', row.mime_type);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
      res.send(Buffer.from(row.content, 'base64'));
    } else {
      res.status(404).send("Imagen no encontrada");
    }
  } catch (err) {
    console.error("GET /api/media error:", err);
    res.status(500).send("Error de servidor");
  }
};
