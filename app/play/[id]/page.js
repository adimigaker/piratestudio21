import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

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

// Komponen Client
function ClientPlayerContent({ film, episodes }) {
  'use client'
  const { useSearchParams } = require('next/navigation')
  const { useState, useEffect } = require('react')
  
  const searchParams = useSearchParams()
  const epParam = searchParams.get('ep')
  const [selectedEp, setSelectedEp] = useState(null)
  const [isTrailer, setIsTrailer] = useState(false)
  const [server, setServer] = useState('embed') // 'embed' atau 'mirror'

  // Inisialisasi episode pertama
  useEffect(() => {
    if (episodes.length > 0 && !selectedEp) {
      const epNum = epParam ? parseInt(epParam) : episodes[0].ep
      const found = episodes.find(ep => ep.ep === epNum)
      setSelectedEp(found || episodes[0])
    }
  }, [episodes, epParam, selectedEp])

  // Update episode saat parameter ep berubah
  useEffect(() => {
    if (epParam && episodes.length > 0) {
      const epNum = parseInt(epParam)
      const found = episodes.find(ep => ep.ep === epNum)
      if (found) setSelectedEp(found)
    }
  }, [epParam, episodes])

  // Tentukan URL player berdasarkan server yang dipilih
  let embedUrl = ''
  if (isTrailer) {
    embedUrl = film.trailer
  } else {
    if (film.type === 'series' && selectedEp) {
      embedUrl = server === 'embed' ? selectedEp.embed : selectedEp.mirror
    } else {
      embedUrl = server === 'embed' 
        ? (typeof film.embed_url === 'string' ? film.embed_url : '')
        : film.mirror_url
    }
  }

  const hasTrailer = !!film.trailer
  const hasMirror = film.type === 'series' 
    ? (selectedEp && selectedEp.mirror)
    : !!film.mirror_url

  return (
    <div>
      {/* Tombol Trailer / Full Film/Series */}
      {hasTrailer && (
        <div className="server-bar" style={{ marginTop: '16px' }}>
          <button
            className={`server-btn ${isTrailer ? 'active' : ''}`}
            onClick={() => setIsTrailer(true)}
          >
            🎬 Trailer
          </button>
          <button
            className={`server-btn ${!isTrailer ? 'active' : ''}`}
            onClick={() => setIsTrailer(false)}
          >
            {film.type === 'series' ? '📺 Full Series' : '🎥 Full Film'}
          </button>
        </div>
      )}

      {/* Tombol Server Selector (hanya jika ada mirror) */}
      {!isTrailer && hasMirror && (
        <div className="server-bar" style={{ marginTop: '16px' }}>
          <span className="server-label">Server:</span>
          <button
            className={`server-btn ${server === 'embed' ? 'active' : ''}`}
            onClick={() => setServer('embed')}
          >
            Server 1
          </button>
          <button
            className={`server-btn ${server === 'mirror' ? 'active' : ''}`}
            onClick={() => setServer('mirror')}
          >
            Server 2
          </button>
        </div>
      )}

      {/* Player */}
      <div className="player-wrapper" style={{ marginTop: '16px' }}>
        <div className="player-aspect">
          {embedUrl ? (
            <iframe
              src={embedUrl}
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

      {/* Daftar Episode (Hanya untuk Series) */}
      {!isTrailer && film.type === 'series' && episodes.length > 0 && (
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
                  color: '#fff',
                  fontSize: '14px'
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

// Bungkus dengan Suspense
function ClientPlayer({ film, episodes }) {
  return (
    <Suspense fallback={<div className="player-loading">Memuat player...</div>}>
      <ClientPlayerContent film={film} episodes={episodes} />
    </Suspense>
  )
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  if (!film) notFound()

  const isSeries = film.type === 'series'
  const episodes = isSeries ? parseEpisodes(film.embed_url) : []

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <a href="/" className="back-btn">← Kembali ke Home</a>

      <h1 className="info-title">
        {film.title} ({film.year})
        {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
      </h1>

      <ClientPlayer film={film} episodes={episodes} />

      {film.synopsis && (
        <div className="info-synopsis" style={{ marginTop: '24px' }}>
          <div className="info-synopsis-label">Sinopsis</div>
          <p>{film.synopsis}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '24px', marginBottom: '40px' }}>
        {film.download_url && (
          <a href={film.download_url} target="_blank" className="btn-action btn-action-download">
            ⬇️ Download
          </a>
        )}
        {film.subtitle_url && (
          <a href={film.subtitle_url} target="_blank" className="btn-action">
            📝 Subtitle
          </a>
        )}
      </div>
    </div>
  )
}