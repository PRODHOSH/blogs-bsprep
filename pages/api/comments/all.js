import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getAdminUser } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  const admin = await getAdminUser(req, res);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("comments")
      .select("id, post_slug, name, content, created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  res.status(405).end();
}
