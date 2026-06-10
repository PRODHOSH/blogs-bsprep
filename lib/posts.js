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

  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkRehype } = await import("remark-rehype");
  const { default: rehypeRaw } = await import("rehype-raw");
  const { default: rehypeHighlight } = await import("rehype-highlight");
  const { default: rehypeStringify } = await import("rehype-stringify");

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
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
