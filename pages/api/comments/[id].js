import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getAdminUser } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  const { id } = req.query;
  const numId = Number(id);

  const admin = await getAdminUser(req, res);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin.from("comments").delete().eq("id", numId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  res.status(405).end();
}
