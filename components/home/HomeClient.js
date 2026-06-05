'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

function FilmCard({ film }) {
  return (
    <a href={`/play/${film.id}`} className="film-card">
      <img src={film.poster || '/placeholder.jpg'} alt={film.title} />
      <div className="card-overlay"></div>
      <div className="card-info-bottom">
        <div className="card-title">{film.title}</div>
        <div className="card-year">{film.year} • {film.rating}⭐</div>
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
          🎬 Featured
        </div>
        <h1 className="hero-title">{film.title}</h1>
        <div className="hero-meta">
          <span className="hero-year">{film.year || '—'}</span>
          {film.rating && (
            <span className="hero-rating">⭐ {film.rating}</span>
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
          <a href={`/play/${film.id}`} className="btn btn-primary">
            ▶️ Tonton Sekarang
          </a>
          <a href={`/play/${film.id}`} className="btn btn-secondary">
            ℹ️ Info Lebih
          </a>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ title, icon, count }) {
  return (
    <div className="section-header">
      <h2 className="section-title">
        {icon === 'star' && '⭐'}
        {icon === 'clock' && '🕐'}
        {icon === 'fire' && '🔥'}
        {!icon && '🎬'} {title}
      </h2>
      {count && <span className="section-count">{count} film</span>}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div className="spinner-lg"></div>
      <p style={{ marginTop: '12px', color: '#888' }}>Memuat film...</p>
    </div>
  )
}

export default function HomeClient({ 
  initialFilms, 
  totalFilms, 
  initialGenres, 
  featuredFilm, 
  popularFilms 
}) {
  const [films, setFilms] = useState(initialFilms)
  const [offset, setOffset] = useState(initialFilms.length)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialFilms.length < totalFilms)
  const [activeGenre, setActiveGenre] = useState('')
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
    setActiveGenre(genre)
    if (genre === '') {
      // Reset ke initial films (yang pertama)
      setFilms(initialFilms)
      setOffset(initialFilms.length)
      setHasMore(initialFilms.length < totalFilms)
    } else {
      // Filter dari semua film (perlu API call)
      fetch(`/api/films?genre=${encodeURIComponent(genre)}`)
        .then(res => res.json())
        .then(filtered => {
          setFilms(filtered)
          setHasMore(false) // Tidak ada lazy loading untuk filter
        })
    }
  }

  // Untuk filter genre, reset infinite scroll
  useEffect(() => {
    if (activeGenre === '') {
      // Reset ke state awal
      setFilms(initialFilms)
      setOffset(initialFilms.length)
      setHasMore(initialFilms.length < totalFilms)
    }
  }, [activeGenre, initialFilms, totalFilms])

  return (
    <>
      <HeroSection film={featuredFilm} />
      
      <div className="container">
        
        {/* Popular Section */}
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
        
        {/* Genre Tags */}
        <div className="genre-tags">
          <span className="genre-label">🎬 Genre:</span>
          <button 
            className={`genre-tag ${activeGenre === '' ? 'active' : ''}`}
            onClick={() => filterByGenre('')}
          >
            Semua
          </button>
          {genres.slice(0, 12).map((g) => (
            <button
              key={g}
              className={`genre-tag ${activeGenre === g ? 'active' : ''}`}
              onClick={() => filterByGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
        
        {/* Film Grid (Terbaru / Hasil Filter) */}
        <section className="section">
          <SectionHeader 
            title={activeGenre ? `Genre: ${activeGenre}` : "Terbaru"} 
            icon="clock" 
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
              ✅ Semua {totalFilms} film sudah ditampilkan
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