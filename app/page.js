import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  // Ambil data film dari Supabase
  const { data: films, error } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .limit(10)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <h1>Pirate Studio 21</h1>
      <div className="film-grid">
        {films.map((film) => (
          <a key={film.id} href={`/play/${film.id}`} className="film-card">
            <img src={film.poster} alt={film.title} />
            <div className="card-title">{film.title}</div>
            <div className="card-year">{film.year}</div>
          </a>
        ))}
      </div>
    </div>
  )
}