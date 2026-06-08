import Head from "next/head";
import Link from "next/link";
import styles from "../styles/NotFound.module.css";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | BSPrep Blogs</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This page doesn't exist</h1>
        <p className={styles.sub}>
          The page you're looking for may have been moved, renamed, or never existed.
        </p>
        <Link href="/" className="main-button">
          ← Back to all posts
        </Link>
      </div>
    </>
  );
}
