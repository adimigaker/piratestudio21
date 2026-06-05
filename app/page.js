import { supabase } from '@/lib/supabaseClient'

// =============================================
// FUNGSI AMBIL DATA
// =============================================

async function getFeatured() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('featured', true)
    .limit(6)
  return data || []
}

async function getPopular() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('popular', true)
    .limit(8)
  return data || []
}

async function getLatest(limit = 12) {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .order('year', { ascending: false })
    .limit(limit)
  return data || []
}

async function getGenres() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('genre')
  
  if (!data) return []
  
  const genreSet = new Set()
  for (const film of data) {
    if (film.genre) {
      film.genre.split(',').forEach(g => genreSet.add(g.trim()))
    }
  }
  return Array.from(genreSet).sort()
}

// =============================================
// COMPONENT CARD (Server Component)
// =============================================

function FilmCard({ film, index = 0 }) {
  const genres = film.genre ? film.genre.split(',').map(g => g.trim()) : []
  const genreBadge = genres[0] || ''
  const delay = index * 0.05

  return (
    <div 
      className="film-card" 
      style={{ animationDelay: `${delay}s` }}
      onClick={() => window.location.href = `/play/${film.id}`}
    >
      <img 
        src={film.poster || ''} 
        alt={film.title} 
        loading="lazy"
        onError={(e) => { e.target.style.background = '#1a1a24'; e.target.style.objectFit = 'contain'; }}
      />
      
      {genreBadge && (
        <div className="card-badge">{genreBadge}</div>
      )}
      
      <div className="card-type">{film.type || 'movie'}</div>
      
      {film.rating && (
        <div className="card-rating">
          ⭐ {film.rating}
        </div>
      )}
      
      <div className="card-overlay"></div>
      
      <div className="card-info-bottom">
        <div className="card-title">{film.title}</div>
        <div className="card-year">{film.year || ''}</div>
      </div>
      
      <div className="card-hover">
        <div className="card-play-btn">▶️</div>
        <div className="card-hover-title">{film.title}</div>
        <div className="card-hover-meta">
          <span>{film.year || '—'}</span>
          {film.rating && (
            <>
              <span>·</span>
              <span style={{ color: '#f5c518' }}>⭐ {film.rating}</span>
            </>
          )}
        </div>
      </div>
    </div>
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

function GenreTags({ genres, activeGenre = '' }) {
  return (
    <div className="genre-tags">
      <span className="genre-label">🎬 Genre:</span>
      <a href="/" className={`genre-tag ${!activeGenre ? 'active' : ''}`}>Semua</a>
      {genres.slice(0, 12).map((g) => (
        <a key={g} href={`/?genre=${encodeURIComponent(g)}`} className={`genre-tag ${g === activeGenre ? 'active' : ''}`}>
          {g}
        </a>
      ))}
    </div>
  )
}

function SectionHeader({ title, icon, count, seeAllLink }) {
  return (
    <div className="section-header">
      <h2 className="section-title">
        {icon === 'star' && '⭐'}
        {icon === 'clock' && '🕐'}
        {icon === 'fire' && '🔥'}
        {!icon && '🎬'} {title}
      </h2>
      {count && <span className="section-count">{count} film</span>}
      {seeAllLink && (
        <a href={seeAllLink} className="see-all">
          Lihat Semua →
        </a>
      )}
    </div>
  )
}

// =============================================
// MAIN PAGE
// =============================================

export default async function Home({ searchParams }) {
  const genreFilter = (await searchParams).genre || ''
  
  const [featured, popular, allLatest, allGenres] = await Promise.all([
    getFeatured(),
    getPopular(),
    getLatest(12),
    getGenres()
  ])
  
  // Filter berdasarkan genre jika ada parameter genre
  let latest = allLatest
  if (genreFilter) {
    latest = allLatest.filter(film => 
      film.genre && film.genre.toLowerCase().includes(genreFilter.toLowerCase())
    )
  }
  
  // Pilih film random untuk hero
  const randomFeatured = featured.length > 0 
    ? featured[Math.floor(Math.random() * featured.length)]
    : (allLatest[0] || null)

  return (
    <div>
      <HeroSection film={randomFeatured} />
      
      <div className="container">
        <GenreTags genres={allGenres} activeGenre={genreFilter} />
      </div>
      
      {/* Terpopuler */}
      {popular.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader title="Terpopuler" icon="fire" count={popular.length} seeAllLink="/" />
            <div className="film-grid grid-6">
              {popular.map((film, i) => (
                <FilmCard key={film.id} film={film} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Terbaru */}
      {latest.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader 
              title={genreFilter ? `Hasil untuk Genre: ${genreFilter}` : 'Terbaru'} 
              icon="clock" 
              count={latest.length} 
            />
            <div className="film-grid">
              {latest.map((film, i) => (
                <FilmCard key={film.id} film={film} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {latest.length === 0 && (
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>Tidak ada film dalam genre ini.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>← Lihat Semua Film</a>
        </div>
      )}
    </div>
  )
}