// Regenerate sitemap setiap 1 jam tanpa perlu deploy ulang
export const revalidate = 3600

export default async function sitemap() {
  const baseUrl = 'https://piratestudio.vercel.app'
  const today = new Date()
  
  let films = []
  let genres = new Set()
  
  try {
    // Ambil semua film dari API internal
    const filmRes = await fetch(`${baseUrl}/api/films?limit=100&offset=0`)
    if (filmRes.ok) {
      const data = await filmRes.json()
      films = data
    }
    
    // Ambil semua genre dari database
    const supabaseUrl = 'https://eogdtpkiwzlarllnxsrj.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ2R0cGtpd3psYXJsbG54c3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODg0NzMsImV4cCI6MjA4OTY2NDQ3M30.eZPbYTuaDerKL9SOEa4ctkxSlU1PiEAU9l42czgYOyI'
    
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
  
  const routes = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]
  
  // URL film
  const filmRoutes = films.map((film) => ({
    url: `${baseUrl}/play/${film.id}`,
    lastModified: film.updated_at ? new Date(film.updated_at) : today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  // URL genre
  const genreRoutes = Array.from(genres).map((genre) => ({
    url: `${baseUrl}/?genre=${encodeURIComponent(genre)}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  console.log(`Sitemap generated: ${routes.length} static, ${filmRoutes.length} films, ${genreRoutes.length} genres`)
  
  return [...routes, ...filmRoutes, ...genreRoutes]
}