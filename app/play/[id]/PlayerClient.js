'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Fungsi mergeEpisodes (copy dari player.js asli)
function mergeEpisodes(film) {
  function parseCol(val) {
    if (!val) return []
    if (typeof val === 'string') {
      try { 
        var p = JSON.parse(val)
        return Array.isArray(p) ? p : []
      } catch(e) { 
        return [] 
      }
    }
    return Array.isArray(val) ? val : []
  }

  var embeds    = parseCol(film.embed_url)
  var downloads = parseCol(film.download_url)
  var mirrors   = parseCol(film.mirror_url)
  var subtitles = parseCol(film.subtitle_url)

  // Kalau embed_url sudah format lama (punya semua field), pakai langsung
  if (embeds.length > 0 && embeds[0].download !== undefined) {
    return embeds
  }

  // Format baru — merge berdasarkan ep number
  var map = {}

  embeds.forEach(function(e) {
    var n = e.ep
    if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' }
    map[n].embed = e.embed || ''
  })
  downloads.forEach(function(e) {
    var n = e.ep
    if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' }
    map[n].download = e.download || ''
  })
  mirrors.forEach(function(e) {
    var n = e.ep
    if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' }
    map[n].mirror = e.mirror || ''
  })
  subtitles.forEach(function(e) {
    var n = e.ep
    if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' }
    map[n].subtitle = e.subtitle || ''
  })

  // Sort by ep number
  return Object.values(map).sort(function(a, b) { return a.ep - b.ep })
}

export default function PlayerClient({ film }) {
  const searchParams = useSearchParams()
  const [episodes, setEpisodes] = useState([])
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isTrailer, setIsTrailer] = useState(false)

  // Inisialisasi data series
  useEffect(() => {
    if (film.type === 'series') {
      const merged = mergeEpisodes(film)
      setEpisodes(merged)
      
      const epParam = searchParams.get('ep')
      let targetEp = null
      if (epParam && merged.length) {
        targetEp = merged.find(ep => ep.ep === parseInt(epParam))
      }
      setCurrentEpisode(targetEp || merged[0] || null)
    }
    
    // Set trailer mode jika ada trailer
    if (film.trailer) {
      setIsTrailer(false)
    }
  }, [film, searchParams])

  // Fungsi ganti episode
  const changeEpisode = (ep) => {
    setIsTrailer(false)
    setCurrentEpisode(ep)
    const url = new URL(window.location.href)
    url.searchParams.set('ep', ep.ep)
    window.history.pushState({}, '', url)
  }

  // Tentukan URL yang diputar
  let activeUrl = ''
  if (isTrailer && film.trailer) {
    activeUrl = film.trailer
  } else if (film.type === 'series' && currentEpisode) {
    activeUrl = currentEpisode.embed
  } else {
    activeUrl = typeof film.embed_url === 'string' ? film.embed_url : ''
  }

  const hasTrailer = !!film.trailer
  const isSeries = film.type === 'series'

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <a href="/" className="back-btn">← Kembali ke Home</a>

      {/* Player */}
      <div className="player-wrapper" style={{ marginTop: '20px' }}>
        <div className="player-aspect">
          {activeUrl ? (
            <iframe 
              src={activeUrl}
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

      {/* Tombol Trailer / Full */}
      {(hasTrailer || isSeries) && (
        <div className="server-bar" style={{ marginTop: '16px' }}>
          <span className="server-label">📺</span>
          {hasTrailer && (
            <button 
              className={`server-btn ${isTrailer ? 'active' : ''}`}
              onClick={() => setIsTrailer(true)}
            >
              🎬 Trailer
            </button>
          )}
          <button 
            className={`server-btn ${!isTrailer ? 'active' : ''}`}
            onClick={() => setIsTrailer(false)}
          >
            {isSeries ? '📺 Full Series' : '🎥 Full Film'}
          </button>
        </div>
      )}

      {/* Daftar Episode (hanya untuk series, bukan trailer) */}
      {isSeries && !isTrailer && episodes.length > 0 && (
        <div className="server-bar" style={{ justifyContent: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
          {episodes.map((ep) => (
            <button
              key={ep.ep}
              className={`episode-btn ${currentEpisode?.ep === ep.ep ? 'active' : ''}`}
              onClick={() => changeEpisode(ep)}
            >
              Ep {ep.ep}
            </button>
          ))}
        </div>
      )}

      {/* Info Film */}
      <h1 className="info-title">
        {film.title} ({film.year})
        {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
      </h1>

      {film.synopsis && (
        <div className="info-synopsis">
          <div className="info-synopsis-label">Sinopsis</div>
          <p>{film.synopsis}</p>
        </div>
      )}

      <div className="action-buttons">
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