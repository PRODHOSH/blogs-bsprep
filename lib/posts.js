import { supabasePublic } from "./supabasePublic";
import readingTime from "reading-time";

function mapPost(p) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    tags: p.tags || [],
    date: p.created_at ? p.created_at.split("T")[0] : "",
    readingTime: readingTime(p.content || "").text,
  };
}

export async function getSortedPostsData() {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapPost);
}

export async function getAllPostSlugs() {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (error) throw error;
  return (data || []).map((p) => ({ params: { slug: p.slug } }));
}

export async function getPostData(slug) {
  const { data: post, error } = await supabasePublic
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!post) return null;

  const { remark } = await import("remark");
  const { default: remarkHtml } = await import("remark-html");
  const { default: remarkGfm } = await import("remark-gfm");

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(post.content);

  const rt = readingTime(post.content || "");
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    tags: post.tags || [],
    date: post.created_at ? post.created_at.split("T")[0] : "",
    readingTime: rt.text,
    wordCount: rt.words,
    contentHtml: processed.toString(),
  };
}

export async function getAllTags() {
  const allPosts = await getSortedPostsData();
  const tagSet = new Set();
  allPosts.forEach((p) => {
    if (Array.isArray(p.tags)) p.tags.forEach((t) => tagSet.add(t));
  });
  return Array.from(tagSet).sort();
}
