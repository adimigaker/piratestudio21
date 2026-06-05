'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Fungsi mergeEpisodes
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

  if (embeds.length > 0 && embeds[0].download !== undefined) {
    return embeds
  }

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

  return Object.values(map).sort(function(a, b) { return a.ep - b.ep })
}

// Load Disqus
function loadDisqus(filmId, filmTitle) {
  if (window.DISQUS) {
    window.DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = filmId
        this.page.title = filmTitle
        this.page.url = window.location.href
      }
    })
  } else {
    window.disqus_config = function () {
      this.page.identifier = filmId
      this.page.title = filmTitle
      this.page.url = window.location.href
    }
    const script = document.createElement('script')
    script.src = 'https://piratestudio21.disqus.com/embed.js'
    script.setAttribute('data-timestamp', Date.now())
    document.body.appendChild(script)
  }
}

export default function PlayerClient({ film }) {
  const searchParams = useSearchParams()
  const [episodes, setEpisodes] = useState([])
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isTrailer, setIsTrailer] = useState(false)
  const [server, setServer] = useState('embed')

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
    
    // Load Disqus
    loadDisqus(film.id, film.title)
  }, [film, searchParams])

  const changeEpisode = (ep) => {
    setIsTrailer(false)
    setCurrentEpisode(ep)
    setServer('embed')
    const url = new URL(window.location.href)
    url.searchParams.set('ep', ep.ep)
    window.history.pushState({}, '', url)
  }

  let activeUrl = ''
  if (isTrailer && film.trailer) {
    activeUrl = film.trailer
  } else if (film.type === 'series' && currentEpisode) {
    activeUrl = server === 'embed' ? currentEpisode.embed : currentEpisode.mirror
  } else {
    activeUrl = server === 'embed' 
      ? (typeof film.embed_url === 'string' ? film.embed_url : '')
      : film.mirror_url
  }

  const hasTrailer = !!film.trailer
  const isSeries = film.type === 'series'
  const hasMirror = isSeries 
    ? (currentEpisode && currentEpisode.mirror)
    : !!film.mirror_url

  return (
    <div className="player-container">
      {/* Back button - pakai SVG rumah */}
      <div className="container" style={{ maxWidth: '900px', paddingTop: '16px' }}>
        <a href="/" className="back-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Kembali
        </a>
      </div>

      {/* Player */}
      <div className="player-wrapper" style={{ marginTop: '8px' }}>
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

      {/* Server Bar (Trailer & Full) - SELALU TAMPIL, minimal ada tombol Full Film */}
      <div className="server-bar" style={{ marginTop: '8px' }}>
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

      {/* Server Selector (Server 1 / 2) */}
      {!isTrailer && hasMirror && (
        <div className="server-bar" style={{ marginTop: '4px' }}>
          <span className="server-label">🔧 Server:</span>
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

      {/* Daftar Episode */}
      {isSeries && !isTrailer && episodes.length > 0 && (
        <div className="server-bar" style={{ justifyContent: 'flex-start', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
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

      {/* Info Film - diberi jarak dari player */}
      <div className="container" style={{ maxWidth: '900px', marginTop: '24px' }}>
        <h1 className="info-title">
          {film.title} ({film.year})
          {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
        </h1>

        {film.synopsis && (
          <div className="info-synopsis" style={{ marginTop: '12px' }}>
            <div className="info-synopsis-label">Sinopsis</div>
            <p>{film.synopsis}</p>
          </div>
        )}

        <div className="action-buttons" style={{ marginTop: '20px', marginBottom: '30px' }}>
  {film.download_url && (
    <a 
      href={film.download_url} 
      download
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-action btn-action-download"
    >
      ⬇️ Download
    </a>
  )}
  {film.subtitle_url && (
    <a 
      href={film.subtitle_url} 
      download
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-action"
    >
      📝 Subtitle
    </a>
  )}
</div>

        {/* Disqus Comments */}
        <div className="comments-section">
          <div className="comments-title">💬 Komentar</div>
          <div id="disqus_thread"></div>
        </div>
      </div>
    </div>
  )
}