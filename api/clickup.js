export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { listId } = req.query;
  const TOKEN = "pk_242560297_PS70E8KRT5JAQZ391L41CC9UA1PJ11P3";

  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?include_closed=false`,
      { headers: { "Authorization": TOKEN } }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
