export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pirate Studio 21 - Streaming Film & Series</title>
        <meta name="description" content="Nonton streaming film dan series subtitle Indonesia gratis. Koleksi film terbaru dan terlengkap." />
      </head>
      <body style={{ backgroundColor: '#0a0a0f', color: 'white', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
