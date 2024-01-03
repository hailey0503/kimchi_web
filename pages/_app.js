// pages/_app.js
import React from "react";
import { ThemeProvider } from "../darkModeContext.js";
import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Script from "next/script";
import Image from "next/image.js";
import logo from "public/kimchi_rec.png";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>
          김치 웨일 -kimchiwhale kimchi coin blockchain data 김치코인 데이터
          김프 김치 프리미엄 kimchi premium klay, klaytn, whalealert, wemix,
          search, blockchain, crypto, currency, 클레이, 클레이튼,
          위믹스,블록체인, 카카오 클레이, 카카오 클레이튼, 김치코인{" "}
        </title>
        <meta
          property="description"
          content="김치코인 데이터 찾기, 김치 웨일 kimchiwhale, find kimchi coin blockchain data, 실시간 김프 김치 프리미엄 real-time kimchi premium "
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-2625840607267766"
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <meta
          name="keywords"
          content="klay, klaytn, whalealert, wemix, search, blockchain, crypto, currency, 클레이, 클레이튼, 위믹스,블록체인, 카카오 클레이, 카카오 클레이튼, 김치코인"
        />
        <meta property="og:title" content="kimchiWhale" />
        <meta property="og:url" content="https://kimchiwhale.io/" />
        <meta property="og:image" content="https://www.kimchiwhale.io/api/og"></meta>
        <meta
          property="og:description"
          content="김치웨일에서 실시간 김프를 확인하세요."
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="kimchiWhale" />
        <meta name="twitter:url" content="https://kimchiwhale.io/" />
        <meta name="twitter:image" content="https://www.kimchiwhale.io/api/og" />

        <meta
          name="twitter:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />

      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
