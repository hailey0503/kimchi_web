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