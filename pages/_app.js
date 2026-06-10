import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "highlight.js/styles/atom-one-dark.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  const page = <Component {...pageProps} />;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8RNKH07HZM"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8RNKH07HZM');
        `}
      </Script>

      {isAdmin ? page : <Layout>{page}</Layout>}
    </>
  );
}
