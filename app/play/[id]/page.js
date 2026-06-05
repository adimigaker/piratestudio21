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
    <div className="container" style={{ paddingTop: '80px' }}>
      <a href="/" className="back-btn">← Kembali</a>
      
      <div className="player-wrapper" style={{ marginTop: '20px' }}>
        <div className="player-aspect">
          {film.embed_url ? (
            <iframe 
              src={film.embed_url}
              width="100%"
              height="100%"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
              allowFullScreen
            />
          ) : (
            <div className="player-loading">Embed URL belum tersedia</div>
          )}
        </div>
      </div>
      
      <h1 className="info-title">{film.title} ({film.year})</h1>
      
      {film.synopsis && (
        <div className="info-synopsis">
          <p>{film.synopsis}</p>
        </div>
      )}
      
      {film.download_url && (
        <a href={film.download_url} target="_blank" className="btn-action btn-action-download">
          Download
        </a>
      )}
    </div>
  )
}