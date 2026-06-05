'use client'

import { useState } from 'react'

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

export default function HomeClient({ initialFilms, initialGenres, featuredFilm, popularFilms }) {
  const [films, setFilms] = useState(initialFilms)
  const [activeGenre, setActiveGenre] = useState('')
  const [genres] = useState(initialGenres)

  const filterByGenre = (genre) => {
    setActiveGenre(genre)
    if (genre === '') {
      setFilms(initialFilms)
    } else {
      const filtered = initialFilms.filter(film => 
        film.genre && film.genre.toLowerCase().includes(genre.toLowerCase())
      )
      setFilms(filtered)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection film={featuredFilm} />
      
      <div className="container">
        
        {/* Popular Section */}
        {popularFilms && popularFilms.length > 0 && (
          <section className="section">
            <SectionHeader title="Terpopuler" icon="fire" count={popularFilms.length} />
            <div className="film-grid grid-6">
              {popularFilms.map((film, i) => (
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
            count={films.length} 
          />
          <div className="film-grid">
            {films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
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