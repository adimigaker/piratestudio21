import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../styles/style.css';
import '../styles/player.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pirate Studio 21 - Streaming Film & Series</title>
        <meta name="description" content="Nonton streaming film dan series subtitle Indonesia gratis." />
        <meta name="keywords" content="ps21, nonton film, streaming film, anime streaming, movie download" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}