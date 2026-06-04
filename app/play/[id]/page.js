import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

async function getFilm(id) {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('id', id)
    .single()
  
  return data
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  
  if (!film) {
    notFound()
  }
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Back button */}
      <a href="/" style={{ color: '#e50914', textDecoration: 'none' }}>← Kembali</a>
      
      {/* Player */}
      <div style={{ marginTop: '20px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
        {film.embed_url ? (
          <iframe 
            src={film.embed_url}
            width="100%"
            height="500"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : (
          <p style={{ textAlign: 'center', padding: '50px' }}>Embed URL tidak tersedia</p>
        )}
      </div>
      
      {/* Info Film */}
      <div style={{ marginTop: '30px' }}>
        <h1>{film.title} ({film.year})</h1>
        <p>⭐ {film.rating || 'N/A'} | 🎬 {film.duration || 'N/A'} | Genre: {film.genre}</p>
        <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{film.synopsis}</p>
      </div>
      
      {/* Download & Subtitle */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        {film.download_url && (
          <a href={film.download_url} target="_blank" style={{ background: '#e50914', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px' }}>
            Download
          </a>
        )}
        {film.subtitle_url && (
          <a href={film.subtitle_url} target="_blank" style={{ background: '#333', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px' }}>
            Subtitle
          </a>
        )}
      </div>
    </div>
  )
}
