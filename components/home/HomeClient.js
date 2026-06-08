'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// SVG Icons
const Icons = {
  star: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  fire: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  film: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  genre: () => (
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
  play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  spinner: () => (
    <div className="spinner-lg"></div>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function FilmCard({ film }) {
  const genres = film.genre ? film.genre.split(',').map(g => g.trim()) : []
  const genreBadge = genres[0] || ''
  const type = film.type === 'series' ? 'SERIES' : 'MOVIE'

  return (
    <a 
      href={`/play/${film.id}`} 
      className="film-card"
      tabIndex={0}
    >
      <img src={film.poster || '/placeholder.jpg'} alt={film.title} loading="lazy" />

      {genreBadge && (
        <div className="card-badge">{genreBadge}</div>
      )}

      <div className="card-type">{type}</div>

      {film.rating && (
        <div className="card-rating">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {film.rating}
        </div>
      )}

      <div className="card-overlay"></div>

      <div className="card-info-bottom">
        <div className="card-title">{film.title}</div>
        <div className="card-year">{film.year || ''}</div>
      </div>

      <div className="card-hover">
        <div className="card-play-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <div className="card-hover-title">{film.title}</div>
        <div className="card-hover-meta">
          <span>{film.year || '—'}</span>
          {film.rating && (
            <>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {film.rating}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  )
}

function HeroSection({ film }) {
  if (!film) return null

  const genres = film.genre ? film.genre.split(',').map(g => g.trim()) : []
  const backdrop = film.backdrop || film.poster || ''

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url('${backdrop}')` }}></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <Icons.film /> Featured
        </div>
        <h1 className="hero-title">{film.title}</h1>
        <div className="hero-meta">
          <span className="hero-year">{film.year || '—'}</span>
          {film.rating && (
            <span className="hero-rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {film.rating}
            </span>
          )}
          {genres.slice(0, 3).map((g, i) => (
            <span key={i} className="hero-genre">{g}</span>
          ))}
          <span className="hero-genre" style={{ opacity: 0.6 }}>
            {(film.type || 'movie').toUpperCase()}
          </span>
        </div>
        <p className="hero-desc">
          {film.synopsis ? film.synopsis.substring(0, 180) + '...' : ''}
        </p>
        <div className="hero-actions">
          <a href={`/play/${film.id}`} className="btn btn-primary" tabIndex={0}>
            <Icons.play /> Tonton Sekarang
          </a>
          <a href={`/play/${film.id}`} className="btn btn-secondary" tabIndex={0}>
            <Icons.info /> Info Lebih
          </a>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ title, icon, count }) {
  let IconComponent = null
  if (icon === 'star') IconComponent = Icons.star
  else if (icon === 'clock') IconComponent = Icons.clock
  else if (icon === 'fire') IconComponent = Icons.fire
  else if (icon === 'film') IconComponent = Icons.film

  return (
    <div className="section-header">
      <h2 className="section-title">
        {IconComponent && <IconComponent />} {title}
      </h2>
      {count && <span className="section-count">{count} film</span>}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Icons.spinner />
      <p style={{ marginTop: '12px', color: '#888' }}>Memuat film...</p>
    </div>
  )
}

export default function HomeClient({ 
  initialFilms, 
  totalFilms, 
  initialGenres, 
  featuredFilm, 
  popularFilms,
  initialGenre
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [films, setFilms] = useState(initialFilms)
  const [offset, setOffset] = useState(initialFilms.length)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialFilms.length < totalFilms)
  const [activeGenre, setActiveGenre] = useState(initialGenre || '')
  const [genres] = useState(initialGenres)

  const observerRef = useRef()
  const lastFilmRef = useCallback(node => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !activeGenre) {
        loadMoreFilms()
      }
    })
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, activeGenre])

  const loadMoreFilms = async () => {
    if (loading || !hasMore || activeGenre) return

    setLoading(true)
    try {
      const response = await fetch(`/api/films?offset=${offset}&limit=10`)
      const newFilms = await response.json()

      if (newFilms.length > 0) {
        setFilms(prev => [...prev, ...newFilms])
        setOffset(prev => prev + newFilms.length)
        setHasMore(newFilms.length === 10)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more films:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterByGenre = (genre) => {
    const currentScrollY = window.scrollY
    setActiveGenre(genre)

    if (genre === '') {
      router.push(pathname, { scroll: false })
    } else {
      router.push(`/?genre=${encodeURIComponent(genre)}`, { scroll: false })
    }

    setTimeout(() => {
      window.scrollTo(0, currentScrollY)
    }, 50)
  }

  useEffect(() => {
    setFilms(initialFilms)
    setOffset(initialFilms.length)
    setHasMore(initialFilms.length < totalFilms)
    setActiveGenre(initialGenre || '')
  }, [initialFilms, totalFilms, initialGenre])

  return (
    <>
      <HeroSection film={featuredFilm} />

      <div className="container">

        {popularFilms && popularFilms.length > 0 && (
          <section className="section">
            <SectionHeader title="Terpopuler" icon="fire" count={popularFilms.length} />
            <div className="film-grid grid-6">
              {popularFilms.map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          </section>
        )}

        <div className="genre-tags">
          <span className="genre-label"><Icons.genre /> Genre:</span>
          <button 
            className={`genre-tag ${activeGenre === '' ? 'active' : ''}`}
            onClick={() => filterByGenre('')}
            tabIndex={0}
          >
            Semua
          </button>
          {genres.slice(0, 12).map((g) => (
            <button
              key={g}
              className={`genre-tag ${activeGenre === g ? 'active' : ''}`}
              onClick={() => filterByGenre(g)}
              tabIndex={0}
            >
              {g}
            </button>
          ))}
        </div>

        <section className="section">
          <SectionHeader 
            title={activeGenre ? `Genre: ${activeGenre}` : "Terbaru"} 
            icon={activeGenre ? "film" : "clock"}
            count={activeGenre ? films.length : totalFilms} 
          />
          <div className="film-grid">
            {films.map((film, index) => (
              <div
                key={film.id}
                ref={index === films.length - 1 ? lastFilmRef : null}
              >
                <FilmCard film={film} />
              </div>
            ))}
          </div>

          {loading && <LoadingSpinner />}

          {!hasMore && !activeGenre && films.length > 0 && films.length >= totalFilms && (
            <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <Icons.check /> Semua {totalFilms} film sudah ditampilkan
            </p>
          )}
        </section>

        {films.length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px' }}>
            Tidak ada film dalam genre ini.
          </p>
        )}
      </div>
    </>
  )
}