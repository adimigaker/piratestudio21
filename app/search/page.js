// app/search/page.js
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fungsi untuk mencari film berdasarkan query
async function searchFilms(query) {
  if (!query) return [];
  
  const { data, error } = await supabase
    .from('PirateStudio21_DB')
    .select('id, slug, title, year, poster, rating, type, genre')
    .ilike('title', `%${query}%`)
    .limit(20);
    
  if (error) {
    console.error('Search error:', error);
    return [];
  }
  
  return data || [];
}

export default async function SearchPage({ searchParams }) {
  // Ambil parameter 'q' dari URL
  const { q } = await searchParams;
  const query = q || '';

  if (!query) {
    notFound(); // Tampilkan 404 jika tidak ada query
  }

  const results = await searchFilms(query);

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <h1 className="info-title">Hasil pencarian: "{query}"</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Menemukan {results.length} film
      </p>

      {results.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>
          Tidak ada film yang cocok dengan "{query}"
        </p>
      ) : (
        <div className="film-grid">
          {results.map((film) => (
            <Link key={film.id} href={`/play/${film.slug}`} className="film-card">
              <img src={film.poster || '/placeholder.jpg'} alt={film.title} />
              <div className="card-overlay"></div>
              <div className="card-info-bottom">
                <div className="card-title">{film.title}</div>
                <div className="card-year">{film.year} • {film.rating}⭐</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}