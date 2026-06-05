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

function parseEpisodes(embedData) {
  if (!embedData) return []
  if (typeof embedData === 'string') {
    try {
      const parsed = JSON.parse(embedData)
      return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
  }
  return Array.isArray(embedData) ? embedData : []
}

// Komponen client untuk interaktivitas (ganti episode, trailer, server)
function ClientPlayer({ film, episodes, initialEp }) {
  'use client'
  import { useSearchParams } from 'next/navigation'
  import { useState, useEffect } from 'react'

  const searchParams = useSearchParams()
  const epParam = searchParams.get('ep')
  const [selectedEp, setSelectedEp] = useState(initialEp)
  const [isTrailer, setIsTrailer] = useState(false)

  // Update episode saat parameter URL berubah
  useEffect(() => {
    if (epParam) {
      const epNum = parseInt(epParam)
      const found = episodes.find(ep => ep.ep === epNum)
      if (found) setSelectedEp(found)
    } else {
      setSelectedEp(episodes[0])
    }
  }, [epParam, episodes])

  const embedUrl = isTrailer 
    ? film.trailer 
    : (selectedEp?.embed || (typeof film.embed_url === 'string' ? film.embed_url : ''))

  return (
    <div>
      {/* Tombol Trailer / Series */}
      {film.trailer && (
        <div className="server-bar" style={{ marginTop: '16px' }}>
          <button className={`server-btn ${isTrailer ? 'active' : ''}`} onClick={() => setIsTrailer(true)}>
            Trailer
          </button>
          <button className={`server-btn ${!isTrailer ? 'active' : ''}`} onClick={() => setIsTrailer(false)}>
            Full Series
          </button>
        </div>
      )}

      {/* Player */}
      <div className="player-wrapper" style={{ marginTop: '16px' }}>
        <div className="player-aspect">
          {embedUrl ? (
            <iframe src={embedUrl} width="100%" height="100%" style={{ border: 'none', position: 'absolute', top: 0, left: 0 }} allowFullScreen />
          ) : (
            <div className="player-loading">Embed URL belum tersedia</div>
          )}
        </div>
      </div>

      {/* Daftar Episode */}
      {!isTrailer && episodes.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#e50914', marginBottom: '12px' }}>Daftar Episode:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {episodes.map((ep) => (
              <a
                key={ep.ep}
                href={`/play/${film.id}?ep=${ep.ep}`}
                style={{
                  padding: '8px 16px',
                  background: selectedEp?.ep === ep.ep ? '#e50914' : '#1a1a2e',
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
    </div>
  )
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  if (!film) notFound()

  const isSeries = film.type === 'series'
  const episodes = isSeries ? parseEpisodes(film.embed_url) : []
  const initialEp = episodes[0] || null

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <a href="/" className="back-btn">← Kembali</a>

      <h1 className="info-title">
        {film.title} ({film.year})
        {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
      </h1>

      {/* Komponen interaktif */}
      <ClientPlayer film={film} episodes={episodes} initialEp={initialEp} />

      {/* Sinopsis */}
      {film.synopsis && (
        <div className="info-synopsis" style={{ marginTop: '24px' }}>
          <p>{film.synopsis}</p>
        </div>
      )}

      {/* Tombol Download & Subtitle */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
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