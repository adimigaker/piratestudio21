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
    <div className="container" style={{ paddingTop: '80px' }}>
      <h1 style={{ color: '#e50914' }}>Pirate Studio 21</h1>
      <p>Streaming film dan series subtitle Indonesia</p>
      
      <div className="film-grid">
        {films.map((film) => (
          <a key={film.id} href={`/play/${film.id}`} className="film-card">
            <img 
              src={film.poster || '/placeholder.jpg'} 
              alt={film.title}
            />
            <div className="card-overlay"></div>
            <div className="card-info-bottom">
              <div className="card-title">{film.title}</div>
              <div className="card-year">{film.year} • {film.rating}⭐</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}