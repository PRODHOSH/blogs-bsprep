import { useEffect, useRef } from "react";
import styles from "../styles/Post.module.css";

// Adds a "Copy" button to every <pre><code> block inside the wrapped content.
export default function CodeBlockEnhancer({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const blocks = container.querySelectorAll("pre");
    const cleanups = [];

    blocks.forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = styles.copyBtn;
      button.textContent = "Copy";

      const onClick = async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.textContent = "Copied!";
        } catch {
          button.textContent = "Failed";
        }
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1500);
      };

      button.addEventListener("click", onClick);
      pre.appendChild(button);
      cleanups.push(() => {
        button.removeEventListener("click", onClick);
        button.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [children]);

  return (
    <div
      ref={ref}
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
