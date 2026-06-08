import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getAdminUser } from "../../../lib/adminAuth";

const SELECT_COLUMNS =
  "id, title, slug, excerpt, content, tags, published, createdAt:created_at, updatedAt:updated_at";

export default async function handler(req, res) {
  const { id } = req.query;
  const numId = Number(id);

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select(SELECT_COLUMNS)
      .eq("id", numId)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  }

  const admin = await getAdminUser(req, res);
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "PUT") {
    const { title, slug, excerpt, content, tags, published } = req.body;

    const { data, error } = await supabaseAdmin
      .from("posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        tags: tags || [],
        published: !!published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", numId)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      return res.status(status).json({ error: error.message });
    }
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", numId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  res.status(405).end();
}
