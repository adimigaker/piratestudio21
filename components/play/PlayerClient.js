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

// SVG Icons
const Icons = {
  home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  film: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
      <line x1="7" y1="2" x2="7" y2="22"/>
      <line x1="17" y1="2" x2="17" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="7" x2="7" y2="7"/>
      <line x1="2" y1="17" x2="7" y2="17"/>
      <line x1="17" y1="7" x2="22" y2="7"/>
      <line x1="17" y1="17" x2="22" y2="17"/>
    </svg>
  ),
  tv: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
      <polyline points="17 2 12 7 7 2"/>
    </svg>
  ),
  server: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6" y2="6"/>
      <line x1="6" y1="18" x2="6" y2="18"/>
    </svg>
  ),
  download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  subtitle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  comment: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
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

// Fungsi download subtitle via API (force download)
const downloadSubtitle = (url) => {
  if (!url) return
  const encodedUrl = encodeURIComponent(url)
  window.open(`/api/download?url=${encodedUrl}`, '_blank')
}

// Helper function untuk cek apakah URL valid
const hasValidUrl = (url) => {
  if (!url) return false
  if (url === '[]') return false
  if (url === '{}') return false
  if (typeof url === 'string' && url.trim() === '') return false
  return true
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

  const isSeries = film.type === 'series'
  const hasTrailer = !!film.trailer

  // Helper functions untuk mendapatkan URL berdasarkan episode saat ini
  const getCurrentMirrorUrl = () => {
    if (isSeries && currentEpisode && currentEpisode.mirror) {
      return currentEpisode.mirror
    }
    return film.mirror_url
  }

  const getCurrentDownloadUrl = () => {
    if (isSeries && currentEpisode && currentEpisode.download) {
      return currentEpisode.download
    }
    return film.download_url
  }

  const getCurrentSubtitleUrl = () => {
    if (isSeries && currentEpisode && currentEpisode.subtitle) {
      return currentEpisode.subtitle
    }
    return film.subtitle_url
  }

  // Tentukan URL player yang aktif
  let activeUrl = ''
  if (isTrailer && film.trailer) {
    activeUrl = film.trailer
  } else if (isSeries && currentEpisode) {
    activeUrl = server === 'embed' ? currentEpisode.embed : getCurrentMirrorUrl()
  } else {
    activeUrl = server === 'embed' 
      ? (typeof film.embed_url === 'string' ? film.embed_url : '')
      : getCurrentMirrorUrl()
  }

  // Cek apakah mirror tersedia untuk episode saat ini
  const hasMirror = isSeries 
    ? (currentEpisode && currentEpisode.mirror && currentEpisode.mirror !== '')
    : hasValidUrl(film.mirror_url)

  return (
    <div className="player-container">
      {/* Back button */}
      <div className="container" style={{ maxWidth: '900px', paddingTop: '16px' }}>
        <a href="/" className="back-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icons.home />
          <span>Kembali</span>
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

      {/* Tab Bar */}
      <div className="server-bar" style={{ marginTop: '8px' }}>
        <span className="server-label"><Icons.tv /></span>
        {hasTrailer && (
          <button 
            className={`server-btn ${isTrailer ? 'active' : ''}`}
            onClick={() => setIsTrailer(true)}
          >
            <Icons.play /> Trailer
          </button>
        )}
        <button 
          className={`server-btn ${!isTrailer ? 'active' : ''}`}
          onClick={() => setIsTrailer(false)}
        >
          <Icons.film /> {isSeries ? 'Full Series' : 'Full Film'}
        </button>
      </div>

      {/* Server Selector */}
      {!isTrailer && hasMirror && (
        <div className="server-bar" style={{ marginTop: '4px' }}>
          <span className="server-label"><Icons.server /></span>
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

      {/* Episode List */}
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

      {/* Info Film - Desain Lama dengan Poster */}
      <div className="container" style={{ maxWidth: '900px', marginTop: '24px' }}>
        <div className="info-grid">
          {/* Poster */}
          <img 
            src={film.poster || '/placeholder.jpg'} 
            alt={film.title} 
            className="info-poster" 
            onError={(e) => { e.target.style.background = '#1a1a24'; e.target.style.objectFit = 'contain'; }}
          />
          
          {/* Info Details */}
          <div className="info-details">
            <h1 className="info-title">
              {film.title} ({film.year})
              {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
            </h1>
            
            <div className="info-meta">
              <span className="info-year">{film.year || '—'}</span>
              {film.rating && (
                <span className="info-rating">
                  <Icons.star /> {film.rating}
                </span>
              )}
              {film.duration && (
                <span className="info-duration">
                  <Icons.clock /> {film.duration}
                </span>
              )}
            </div>
            
            {/* Genre Tags */}
            {film.genre && (
              <div className="info-genres">
                {film.genre.split(',').map((g, i) => (
                  <span key={i} className="info-genre-tag">{g.trim()}</span>
                ))}
              </div>
            )}
            
            {/* Director & Cast & Type */}
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
                  <span className="info-more-value">{film.cast.split(',').slice(0, 3).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sinopsis */}
        {film.synopsis && (
          <div className="info-synopsis">
            <div className="info-synopsis-label">Sinopsis</div>
            <p dangerouslySetInnerHTML={{ __html: film.synopsis }} />
          </div>
        )}
        
        {/* Action Buttons */}
        {!isTrailer && (
          <div className="action-buttons" style={{ marginTop: '20px', marginBottom: '30px' }}>
            {hasValidUrl(getCurrentDownloadUrl()) && (
              <a 
                href={getCurrentDownloadUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-action btn-action-download"
              >
                <Icons.download /> Download
              </a>
            )}
            {hasValidUrl(getCurrentSubtitleUrl()) && (
              <button 
                onClick={() => downloadSubtitle(getCurrentSubtitleUrl())}
                className="btn-action"
              >
                <Icons.subtitle /> Subtitle
              </button>
            )}
          </div>
        )}
        
        {/* Comments */}
        <div className="comments-section">
          <div className="comments-title">
            <Icons.comment /> Komentar
          </div>
          <div id="disqus_thread"></div>
        </div>
      </div>
    </div>
  )
}