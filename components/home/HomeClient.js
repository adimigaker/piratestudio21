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
  ),
  calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  )
}

function FilmCard({ film }) {
  const genres = film.genre ? film.genre.split(',').map(g => g.trim()) : []
  const genreBadge = genres[0] || ''
  const type = film.type === 'series' ? 'SERIES' : 'MOVIE'

  return (
    <a 
      href={`/play/${film.slug}`} 
      className="film-card"
      tabIndex={0}
    >
      <img src={film.poster || '/placeholder.jpg'} alt={film.title} loading="lazy" />

      {/* Genre Badge - kiri atas */}
      {genreBadge && (
        <div className="card-badge">{genreBadge}</div>
      )}

      {/* Type Badge - kanan atas */}
      <div className="card-type">{type}</div>

      {/* Rating Badge - kanan bawah */}
      {film.rating && (
        <div className="card-rating">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {film.rating}
        </div>
      )}

      {/* Overlay */}
      <div className="card-overlay"></div>

      {/* Info Bottom - kiri bawah */}
      <div className="card-info-bottom">
        <div className="card-title">{film.title}</div>
        <div className="card-year">{film.year || ''}</div>
      </div>

      {/* Hover effect */}
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
          {genres.slice(0, 5).map((g, i) => (
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
          <a href={`/play/${film.slug}`} className="btn btn-primary" tabIndex={0}>
            <Icons.play /> Tonton Sekarang
          </a>
          <a href={`/play/${film.slug}`} className="btn btn-secondary" tabIndex={0}>
            <Icons.info /> Info Lebih
          </a>
        </div>
      </div>
    </section>
  )
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
  const [sortType, setSortType] = useState('update')

  // Sentinel dipantau IntersectionObserver — lebih stabil daripada menempelkan ref
  // ke komponen FilmCard (ref tidak diteruskan ke <a> di React 19).
  const sentinelRef = useRef(null)

  // Ref penampung "latest state" supaya callback observer/loader tidak memakai nilai basi.
  const stateRef = useRef({ offset, sortType, loading, hasMore, activeGenre })
  stateRef.current = { offset, sortType, loading, hasMore, activeGenre }

  // Kunci request agar tidak ada dua fetch bersamaan (race saat scroll cepat).
  const lockRef = useRef(false)

  const fetchFilmsWithSort = async (sort, newOffset = 0) => {
    setLoading(true)
    lockRef.current = true
    try {
      const response = await fetch(`/api/films?offset=${newOffset}&limit=12&sort=${sort}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const newFilms = await response.json()
      setFilms(newFilms)
      setOffset(newOffset + newFilms.length)
      setHasMore(newFilms.length === 12)
    } catch (error) {
      console.error('Error fetching films:', error)
    } finally {
      lockRef.current = false
      setLoading(false)
    }
  }

  const loadMoreFilms = useCallback(async () => {
    // Baca state terbaru dari ref, bukan dari closure render yang sudah basi.
    const { offset: curOffset, sortType: curSort, hasMore: curHasMore, activeGenre: curGenre } = stateRef.current
    if (lockRef.current || !curHasMore || curGenre) return

    lockRef.current = true
    setLoading(true)
    try {
      const response = await fetch(`/api/films?offset=${curOffset}&limit=12&sort=${curSort}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const newFilms = await response.json()

      if (newFilms.length > 0) {
        // Buang duplikat bila offset bergeser (mis. ada film baru masuk saat scroll).
        setFilms(prev => {
          const seen = new Set(prev.map(f => f.slug || f.id))
          return [...prev, ...newFilms.filter(f => !seen.has(f.slug || f.id))]
        })
        setOffset(curOffset + newFilms.length)
        setHasMore(newFilms.length === 12)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more films:', error)
    } finally {
      lockRef.current = false
      setLoading(false)
    }
  }, [])

  // Satu-satunya tempat IntersectionObserver dibuat — di-mount ulang setiap kali
  // kondisi berubah, lalu selalu di-disconnect saat unmount.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || activeGenre || loading) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMoreFilms()
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loading, hasMore, activeGenre, loadMoreFilms])

  // Fallback untuk browser/lingkungan yang IntersectionObserver-nya tidak fire
  // (headless, beberapa WebView lama, mode hemat energi). Memakai listener scroll
  // + requestAnimationFrame agar tidak membanjiri event.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || activeGenre) return

    let ticking = false
    const check = () => {
      ticking = false
      const { loading: busy, hasMore: more, activeGenre: genre } = stateRef.current
      if (busy || !more || genre) return
      const rect = node.getBoundingClientRect()
      if (rect.top <= window.innerHeight + 600) loadMoreFilms()
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    check() // jangan menunggu scroll pertama bila sentinel sudah terlihat

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [hasMore, activeGenre, loadMoreFilms])

  useEffect(() => {
    try {
      const savedSort = localStorage.getItem('ps21_sort_preference')
      if (savedSort === 'year' || savedSort === 'update') {
        setSortType(savedSort)
        fetchFilmsWithSort(savedSort, 0)
      }
    } catch {
      // localStorage tidak tersedia (mis. mode privat) — abaikan saja.
    }
  }, [])

  const handleToggleSort = (type) => {
    if (type === sortType) return
    setSortType(type)
    try {
      localStorage.setItem('ps21_sort_preference', type)
    } catch {}
    fetchFilmsWithSort(type, 0)
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
            <SectionHeader title="Terpopuler" icon="fire" />
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
          {genres.map((g) => (
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
            title="Terbaru"
            icon="clock"
            sortType={sortType}
            onToggleSort={handleToggleSort}
          />
          <div className="film-grid grid-6">
            {films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>

          {/* Sentinel: memicu load berikutnya saat masuk viewport. */}
          <div ref={sentinelRef} aria-hidden="true" style={{ height: '1px' }} />

          {loading && <LoadingSpinner />}

          {/* Fallback manual: tetap bisa memuat halaman berikutnya walau
              auto-scroll tidak aktif (browser lama / mode hemat energi). */}
          {hasMore && !activeGenre && !loading && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <button
                onClick={loadMoreFilms}
                className="btn btn-secondary"
                style={{ cursor: 'pointer' }}
                tabIndex={0}
              >
                Muat film lainnya
              </button>
            </div>
          )}

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