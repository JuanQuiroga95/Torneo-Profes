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
    const data = req.body;
    if (!data) {
      res.status(400).json({ error: "Faltan datos en el cuerpo de la petición" });
      return;
    }

    await db.query(
      `INSERT INTO torneo_data (id, data) VALUES ('torneo', $1)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [data]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("POST /api/save-data error:", err);
    res.status(500).json({ error: "Error de servidor al guardar datos" });
  }
};
