const db = require('./db');

module.exports = async (req, res) => {
  // CORS headers
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

  try {
    const result = await db.query("SELECT data FROM torneo_data WHERE id = 'torneo'");
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0].data);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.error("GET /api/get-data error:", err);
    res.status(500).json({ error: "Error de servidor al cargar datos" });
  }
};
