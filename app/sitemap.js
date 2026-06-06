import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap() {
  const baseUrl = 'https://piratestudio.vercel.app'
  
  // Initialize Supabase client
  const supabaseUrl = 'https://eogdtpkiwzlarllnxsrj.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ2R0cGtpd3psYXJsbG54c3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODg0NzMsImV4cCI6MjA4OTY2NDQ3M30.eZPbYTuaDerKL9SOEa4ctkxSlU1PiEAU9l42czgYOyI'
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Fetch all films
  const { data: films, error } = await supabase
    .from('PirateStudio21_DB')
    .select('id, updated_at, genre')
    .order('id')
  
  if (error) {
    console.error('Error fetching films:', error)
    // Return at least the homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ]
  }
  
  // Get unique genres
  const genres = new Set()
  films.forEach(film => {
    if (film.genre) {
      film.genre.split(',').forEach(g => {
        const trimmed = g.trim()
        if (trimmed) genres.add(trimmed)
      })
    }
  })
  
  const currentDate = new Date()
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]
  
  // Dynamic film routes
  const filmRoutes = films.map((film) => ({
    url: `${baseUrl}/play/${film.id}`,
    lastModified: film.updated_at ? new Date(film.updated_at) : currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  // Dynamic genre routes
  const genreRoutes = Array.from(genres).map((genre) => ({
    url: `${baseUrl}/?genre=${encodeURIComponent(genre)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  return [...routes, ...filmRoutes, ...genreRoutes]
}