import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <meta property="og:url" content="https://chatgenie.xyz/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ChatGenie" />
      <meta property="og:description" content="Exploring the future of Human-AI conversation." />
      <meta property="og:site_name" content="ChatGenie" />
      <meta property="og:image" content="https://chatgenie.xyz/img/og-image.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ChatGenie" />
      <meta name="twitter:description" content="Exploring the future of Human-AI conversation." />
      <meta name="twitter:image" content="https://chatgenie.xyz/img/og-image.png" />

      <meta name="theme-color" content="#131517" />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
