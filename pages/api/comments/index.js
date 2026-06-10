import { supabasePublic } from "../../../lib/supabasePublic";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "slug is required" });

    const { data, error } = await supabasePublic
      .from("comments")
      .select("id, name, content, created_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  if (req.method === "POST") {
    const { slug, name, content, website } = req.body || {};

    // Honeypot — real visitors never fill this hidden field.
    if (website) return res.status(400).json({ error: "Invalid submission" });

    const trimmedName = (name || "").trim();
    const trimmedContent = (content || "").trim();

    if (!slug || !trimmedName || !trimmedContent) {
      return res.status(400).json({ error: "Name and comment are required" });
    }
    if (trimmedName.length > 60 || trimmedContent.length > 2000) {
      return res.status(400).json({ error: "Name or comment is too long" });
    }

    const { data, error } = await supabasePublic
      .from("comments")
      .insert({ post_slug: slug, name: trimmedName, content: trimmedContent })
      .select("id, name, content, created_at")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
}
