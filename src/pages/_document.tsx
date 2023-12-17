import { Html, Head, Main, NextScript } from "next/document";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-background">
        <Main />
        <NextScript />
        <SpeedInsights />
      </body>
    </Html>
  );
}
