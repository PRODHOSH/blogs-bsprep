import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "../../lib/supabase/client";
import styles from "../../styles/Admin.module.css";

export default function AdminComments() {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments/all")
      .then((r) => r.json())
      .then((data) => { setComments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function deleteComment(id) {
    if (!confirm("Delete this comment permanently?")) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/signin");
  }

  return (
    <>
      <Head><title>Comments | Admin Dashboard</title></Head>
      <div className={styles.adminLayout}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span className={styles.bracket}>&lt;</span>
            Admin
            <span className={styles.bracket}>/&gt;</span>
          </div>
          <nav className={styles.sidebarNav}>
            <Link href="/admin" className={styles.sidebarLink}>Posts</Link>
            <Link href="/admin/new" className={styles.sidebarLink}>New Post</Link>
            <span className={styles.sidebarLinkActive}>Comments</span>
            <Link href="/blog" className={styles.sidebarLink} target="_blank">View Blog ↗</Link>
          </nav>
          <button onClick={logout} className={styles.logoutBtn}>Log out</button>
        </aside>

        {/* Main */}
        <main className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <div>
              <h1 className={styles.adminTitle}>Comments</h1>
              <p className={styles.adminSub}>{comments.length} total</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingRow}>Loading…</div>
          ) : comments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No comments yet.</p>
            </div>
          ) : (
            <div className={styles.commentTable}>
              <div className={styles.commentTableHead}>
                <span>Post</span>
                <span>Comment</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {comments.map((c) => (
                <div key={c.id} className={styles.commentTableRow}>
                  <div className={styles.commentMeta}>
                    <Link
                      href={`/blog/${c.post_slug}`}
                      className={styles.commentSlug}
                      target="_blank"
                    >
                      {c.post_slug}
                    </Link>
                    <span className={styles.commentName}>{c.name}</span>
                  </div>
                  <p className={styles.commentText}>{c.content}</p>
                  <span className={styles.postDate}>
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className={styles.actions}>
                    <button onClick={() => deleteComment(c.id)} className={styles.deleteBtn}>Delete</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
