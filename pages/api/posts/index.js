import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getAdminUser } from "../../../lib/adminAuth";

const SELECT_COLUMNS =
  "id, title, slug, excerpt, content, tags, published, createdAt:created_at, updatedAt:updated_at";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const admin = await getAdminUser(req, res);

    let query = supabaseAdmin.from("posts").select(SELECT_COLUMNS).order("created_at", { ascending: false });
    if (!admin) query = query.eq("published", true);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === "POST") {
    const admin = await getAdminUser(req, res);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    const { title, slug, excerpt, content, tags, published } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: "title, slug and content are required" });
    }

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({ title, slug, excerpt, content, tags: tags || [], published: !!published })
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      return res.status(status).json({ error: error.message });
    }
    return res.status(201).json(data);
  }

  res.status(405).end();
}
