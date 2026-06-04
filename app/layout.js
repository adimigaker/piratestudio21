export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pirate Studio 21 - Streaming Film & Series</title>
        <meta name="description" content="Nonton streaming film dan series subtitle Indonesia gratis." />
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}