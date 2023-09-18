// pages/_app.js
import React from 'react';
import {  ThemeProvider } from '../darkModeContext.js';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    < ThemeProvider>
      <Component {...pageProps} />
    </ ThemeProvider>
  );
}

export default MyApp;
