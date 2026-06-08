import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="BSPrep" />
        <meta name="theme-color" content="#FAF8F5" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Sitemap + crawling */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Default OG — overridden per page */}
        <meta property="og:site_name" content="BSPrep Blogs" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content="https://blog.bsprep.in/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Default Twitter Card — overridden per page */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://blog.bsprep.in/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
