'use client'

import { useState, useEffect } from 'react'

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

export default function HomeClient({ initialFilms, initialGenres }) {
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
    <div className="container" style={{ paddingTop: '80px' }}>
      <h1 style={{ color: '#e50914' }}>Pirate Studio 21</h1>
      <p>Streaming film dan series subtitle Indonesia</p>
      
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
      
      {/* Film Grid */}
      <div className="film-grid">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
      
      {films.length === 0 && (
        <p style={{ textAlign: 'center', padding: '40px' }}>
          Tidak ada film dalam genre ini.
        </p>
      )}
    </div>
  )
}