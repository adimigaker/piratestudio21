import { supabase } from '@/lib/supabaseClient'

async function getFilms() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .order('year', { ascending: false })
  
  return data || []
}

export default async function Home() {
  const films = await getFilms()
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#e50914' }}>Pirate Studio 21</h1>
      <p>Streaming film dan series subtitle Indonesia</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {films.map((film) => (
          <a key={film.id} href={`/play/${film.id}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div style={{ background: '#1a1a2e', borderRadius: '10px', overflow: 'hidden' }}>
              <img 
                src={film.poster || '/placeholder.jpg'} 
                alt={film.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <h3 style={{ fontSize: '14px', margin: '0' }}>{film.title}</h3>
                <p style={{ fontSize: '12px', color: '#888' }}>{film.year} • {film.rating}⭐</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
