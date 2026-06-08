import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostData } from "../../lib/posts";
import styles from "../../styles/Post.module.css";

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  if (!postData) return { notFound: true };
  return { props: { postData }, revalidate: 60 };
}

export default function Post({ postData }) {
  const { title, date, tags, readingTime, contentHtml, excerpt, wordCount } = postData;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Head>
        <title>{title} | BSPrep Blogs</title>
        <meta name="description" content={excerpt || title} />
        <link rel="canonical" href={`https://blog.bsprep.in/blog/${postData.slug}`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://blog.bsprep.in/blog/${postData.slug}`} />
        <meta property="og:title" content={`${title} | BSPrep Blogs`} />
        <meta property="og:description" content={excerpt || title} />
        <meta property="og:image" content="https://blog.bsprep.in/og-image.png" />
        {date && <meta property="article:published_time" content={new Date(date).toISOString()} />}
        <meta property="article:author" content="Prodhosh VS" />
        {tags && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

        <meta name="twitter:title" content={`${title} | BSPrep Blogs`} />
        <meta name="twitter:description" content={excerpt || title} />
        <meta name="twitter:image" content="https://blog.bsprep.in/og-image.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title,
              description: excerpt || title,
              author: {
                "@type": "Person",
                name: "Prodhosh VS",
                url: "https://prodhosh.me",
                sameAs: [
                  "https://github.com/PRODHOSH",
                  "https://www.linkedin.com/in/prodhoshvs/",
                  "https://twitter.com/prodhosh3",
                ],
              },
              publisher: {
                "@type": "Organization",
                name: "BSPrep Blogs",
                url: "https://blog.bsprep.in",
              },
              url: `https://blog.bsprep.in/blog/${postData.slug}`,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://blog.bsprep.in/blog/${postData.slug}`,
              },
              image: {
                "@type": "ImageObject",
                url: "https://blog.bsprep.in/og-image.png",
                width: 1200,
                height: 630,
              },
              ...(date && { datePublished: new Date(date).toISOString() }),
              ...(date && { dateModified: new Date(date).toISOString() }),
              keywords: tags ? tags.join(", ") : "",
              wordCount: wordCount || 0,
              inLanguage: "en-IN",
              isPartOf: {
                "@type": "Blog",
                name: "BSPrep Blogs",
                url: "https://blog.bsprep.in",
              },
            }),
          }}
        />
      </Head>

      <article className={styles.article}>
        <Link href="/" className={styles.back}>
          ← Back to all posts
        </Link>

        <header className={styles.header}>
          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            <span>
              By{" "}
              <a
                href="https://prodhosh.me"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                Prodhosh VS
              </a>
            </span>
            {formattedDate && (
              <>
                <span className={styles.sep}>·</span>
                <span>{formattedDate}</span>
              </>
            )}
            {readingTime && (
              <>
                <span className={styles.sep}>·</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <footer className={styles.postFooter}>
          <p className={styles.footerText}>
            Thanks for reading! More of my work at{" "}
            <a
              href="https://prodhosh.me"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              prodhosh.me
            </a>
          </p>
          <Link href="/" className="main-button">
            ← More Posts
          </Link>
        </footer>
      </article>
    </>
  );
}
