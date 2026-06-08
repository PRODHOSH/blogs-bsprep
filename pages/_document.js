import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="Prodhosh VS" />
        <meta name="theme-color" content="#FAF8F5" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Default OG — overridden per page */}
        <meta property="og:site_name" content="BSPrep Blogs" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />

        {/* Default Twitter Card — overridden per page */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@prodhosh3" />
        <meta name="twitter:creator" content="@prodhosh3" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
