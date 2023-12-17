import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-background">
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  );
}
