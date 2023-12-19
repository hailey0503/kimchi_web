// pages/_app.js
import React from 'react';
import {  ThemeProvider } from '../darkModeContext.js';
import '../styles/globals.css';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtag from '../lib/gtag'
import Script from 'next/script';


const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
      <meta name="google-adsense-account" content="ca-pub-2625840607267766"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

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
       <meta name="keywords" content="klay, klaytn, whalealert, wemix, search, blockchain, crypto, currency, 클레이, 클레이튼, 위믹스,블록체인, 카카오 클레이, 카카오 클레이튼, 김치코인"/>
        <meta property="og:title" content="kimchiWhale"/>
        <meta property="og:url" content="https://kimchiwhale.io/"/>
        
        <meta
          property="og:description"
          content="김치웨일에서 k블록체인 데이터를 찾아보세요."
        />
        <meta name="twitter:card" content="summary"/>
          
       
        <meta name="twitter:title" content="kimchiWhale"/>
        <meta
          name="twitter:url"
          content="https://kimchiwhale.io/"
        />
        
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
       < ThemeProvider>
      <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp;