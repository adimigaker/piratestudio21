'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// SVG Icons (sama seperti sebelumnya, tambahkan icon untuk toggle)
const Icons = {
  // ... (icons yang sudah ada)
  calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  )
}

function FilmCard({ film }) {
  // ... kode FilmCard sama seperti sebelumnya
}

function HeroSection({ film }) {
  // ... kode HeroSection sama
}

function SectionHeader({ title, icon, count, sortType, onToggleSort }) {
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
      
      {/* Tombol toggle sort untuk section Terbaru */}
      {title === "Terbaru" && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onToggleSort('year')}
            className={`sort-btn ${sortType === 'year' ? 'active' : ''}`}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: sortType === 'year' ? 'var(--accent)' : 'var(--surface)',
              border: '1px solid var(--border)',
              color: sortType === 'year' ? '#fff' : 'var(--text2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Icons.calendar /> Tahun
          </button>
          <button
            onClick={() => onToggleSort('update')}
            className={`sort-btn ${sortType === 'update' ? 'active' : ''}`}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: sortType === 'update' ? 'var(--accent)' : 'var(--surface)',
              border: '1px solid var(--border)',
              color: sortType === 'update' ? '#fff' : 'var(--text2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Icons.refresh /> Update
          </button>
        </div>
      )}
      
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
  const [sortType, setSortType] = useState('update') // 'update' atau 'year'
  
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

  // Load sort preference from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('ps21_sort_preference')
    if (savedSort === 'year' || savedSort === 'update') {
      setSortType(savedSort)
      // Refetch films with new sort
      fetchFilmsWithSort(savedSort, 0)
    }
  }, [])

  const fetchFilmsWithSort = async (sort, newOffset = 0) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/films?offset=${newOffset}&limit=12&sort=${sort}`)
      const newFilms = await response.json()
      setFilms(newFilms)
      setOffset(newFilms.length)
      setHasMore(newFilms.length === 12)
    } catch (error) {
      console.error('Error fetching films:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSort = (type) => {
    setSortType(type)
    localStorage.setItem('ps21_sort_preference', type)
    fetchFilmsWithSort(type, 0)
  }

  const loadMoreFilms = async () => {
    if (loading || !hasMore || activeGenre) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/films?offset=${offset}&limit=10&sort=${sortType}`)
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
        
        {/* Film Grid */}
        <section className="section">
          <SectionHeader 
            title="Terbaru" 
            icon="clock"
            sortType={sortType}
            onToggleSort={handleToggleSort}
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
          
          {!hasMore && !activeGenre && films.length > 0 && (
            <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <Icons.check /> Semua film sudah ditampilkan
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