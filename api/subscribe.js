export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { email, stage, score } = req.body;

  const KIT_API_SECRET = "FOjhYoeu8fYNntX27W1gkFlAwHZuo_8v57xFrxwPsjY";
  const KIT_FORM_ID = "9335523";

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_secret: KIT_API_SECRET,
          email,
          fields: {
            operational_stage: stage,
            overall_score: score,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Kit response:", JSON.stringify(data));
    return res.status(200).json(data);
  } catch (err) {
    console.error("Kit error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
