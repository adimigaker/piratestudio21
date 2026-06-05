export default async function sitemap() {
  const baseUrl = 'https://piratestudio21.vercel.app'
  const today = new Date()
  
  // Fetch film dari Supabase REST API langsung
  const supabaseUrl = 'https://eogdtpkiwzlarllnxsrj.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ2R0cGtpd3psYXJsbG54c3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODg0NzMsImV4cCI6MjA4OTY2NDQ3M30.eZPbYTuaDerKL9SOEa4ctkxSlU1PiEAU9l42czgYOyI'
  
  let films = []
  let genres = new Set()
  
  try {
    // Ambil data film
    const filmRes = await fetch(`${supabaseUrl}/rest/v1/PirateStudio21_DB?select=id,updated_at`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (filmRes.ok) {
      films = await filmRes.json()
    }
    
    // Ambil data genre
    const genreRes = await fetch(`${supabaseUrl}/rest/v1/PirateStudio21_DB?select=genre`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (genreRes.ok) {
      const genreData = await genreRes.json()
      genreData.forEach(film => {
        if (film.genre) {
          film.genre.split(',').forEach(g => {
            const trimmed = g.trim()
            if (trimmed) genres.add(trimmed)
          })
        }
      })
    }
  } catch (error) {
    console.error('Error fetching data for sitemap:', error)
  }
  
  // URL statis (homepage)
  const routes = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]
  
  // URL film dinamis
  const filmRoutes = films.map((film) => ({
    url: `${baseUrl}/play/${film.id}`,
    lastModified: film.updated_at ? new Date(film.updated_at) : today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  // URL genre dinamis
  const genreRoutes = Array.from(genres).map((genre) => ({
    url: `${baseUrl}/?genre=${encodeURIComponent(genre)}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  return [...routes, ...filmRoutes, ...genreRoutes]
}