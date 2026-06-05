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
    <>
      {/* Back button */}
      <div className="container" style={{ maxWidth: '900px', paddingTop: '20px' }}>
        <a href="/" className="back-btn">← Kembali ke Home</a>
      </div>
      
      {/* Player */}
      <div className="player-wrapper">
        <div className="player-aspect">
          {film.embed_url ? (
            <iframe 
              src={film.embed_url}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="player-loading">Embed URL belum tersedia</div>
          )}
        </div>
      </div>
      
      {/* Info Film */}
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="info-section">
          <div className="info-grid">
            <img src={film.poster || ''} className="info-poster" alt={film.title} />
            <div className="info-details">
              <h1 className="info-title">{film.title} ({film.year})</h1>
              <div className="info-meta">
                <span className="info-year">{film.year || '—'}</span>
                {film.rating && (
                  <span className="info-rating">⭐ {film.rating}</span>
                )}
                {film.duration && (
                  <span className="info-duration">🎬 {film.duration}</span>
                )}
              </div>
              {film.genre && (
                <div className="info-genres">
                  {film.genre.split(',').map((g, i) => (
                    <span key={i} className="info-genre-tag">{g.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {film.synopsis && (
            <div className="info-synopsis">
              <div className="info-synopsis-label">Sinopsis</div>
              <p>{film.synopsis}</p>
            </div>
          )}
          
          <div className="info-more">
            {film.director && (
              <div className="info-more-item">
                <span className="info-more-label">Sutradara</span>
                <span className="info-more-value">{film.director}</span>
              </div>
            )}
            {film.cast && (
              <div className="info-more-item">
                <span className="info-more-label">Pemeran</span>
                <span className="info-more-value">{film.cast.split(',').slice(0,3).join(', ')}</span>
              </div>
            )}
            <div className="info-more-item">
              <span className="info-more-label">Tipe</span>
              <span className="info-more-value">{film.type || 'movie'}</span>
            </div>
          </div>
          
          <div className="action-buttons">
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
            <button className="btn-action" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Salin Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}