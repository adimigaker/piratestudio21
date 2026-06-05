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

// Fungsi untuk parse episode dari JSON string
function parseEpisodes(embedData) {
  if (!embedData) return []
  if (typeof embedData === 'string') {
    try {
      const parsed = JSON.parse(embedData)
      if (Array.isArray(parsed)) return parsed
    } catch(e) {
      return []
    }
  }
  return Array.isArray(embedData) ? embedData : []
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  
  if (!film) {
    notFound()
  }
  
  const isSeries = film.type === 'series'
  const episodes = isSeries ? parseEpisodes(film.embed_url) : []
  
  // Untuk series: ambil episode pertama sebagai default
  const defaultEmbedUrl = isSeries 
    ? (episodes[0]?.embed || '') 
    : (typeof film.embed_url === 'string' ? film.embed_url : '')
  
  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <a href="/" className="back-btn">← Kembali</a>
      
      <div className="player-wrapper" style={{ marginTop: '20px' }}>
        <div className="player-aspect">
          {defaultEmbedUrl ? (
            <iframe 
              src={defaultEmbedUrl}
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
      
      <h1 className="info-title">
        {film.title} ({film.year})
        {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
      </h1>
      
      {/* Daftar episode (jika series) */}
      {isSeries && episodes.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#e50914' }}>Daftar Episode:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {episodes.map((ep, idx) => (
              <a 
                key={idx}
                href={`?ep=${ep.ep}`}  // Ganti episode via query param
                style={{
                  padding: '8px 16px',
                  background: '#1a1a2e',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#fff'
                }}
              >
                Episode {ep.ep}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {film.synopsis && (
        <div className="info-synopsis" style={{ marginTop: '20px' }}>
          <p>{film.synopsis}</p>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {film.download_url && (
          <a href={film.download_url} target="_blank" className="btn-action btn-action-download">
            Download
          </a>
        )}
        {film.subtitle_url && (
          <a href={film.subtitle_url} target="_blank" className="btn-action">
            Subtitle
          </a>
        )}
      </div>
    </div>
  )
}