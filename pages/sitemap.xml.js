import { supabasePublic } from "../lib/supabasePublic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://blog.bsprep.in").replace(/\/$/, "");

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function toIsoDate(value) {
  if (!value) return undefined;
  return new Date(value).toISOString().split("T")[0];
}

function buildSitemap(posts) {
  const latestPostDate = posts.reduce((latest, post) => {
    const updated = post.updated_at || post.created_at;
    return !latest || (updated && updated > latest) ? updated : latest;
  }, null);

  const urls = [
    {
      loc: `${SITE_URL}/`,
      lastmod: toIsoDate(latestPostDate) || toIsoDate(new Date()),
      changefreq: "daily",
      priority: "1.0",
    },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: toIsoDate(post.updated_at || post.created_at),
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export async function getServerSideProps({ res }) {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("slug, created_at, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const sitemap = buildSitemap(data || []);

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Serve cached copy instantly, but regenerate in the background so a new
  // post shows up in the sitemap within a minute without a redeploy.
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=3600");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
