import { supabase } from '@/lib/supabaseClient'

export default async function sitemap() {
  const baseUrl = 'https://piratestudio21.vercel.app'
  const today = new Date()
  
  const { data: films } = await supabase
    .from('PirateStudio21_DB')
    .select('id, updated_at')
    .order('id')
  
  const { data: genreData } = await supabase
    .from('PirateStudio21_DB')
    .select('genre')
  
  const genres = new Set()
  if (genreData) {
    genreData.forEach(film => {
      if (film.genre) {
        film.genre.split(',').forEach(g => {
          const trimmed = g.trim()
          if (trimmed) genres.add(trimmed)
        })
      }
    })
  }
  
  const routes = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]
  
  const filmRoutes = (films || []).map((film) => ({
    url: `${baseUrl}/play/${film.id}`,
    lastModified: film.updated_at ? new Date(film.updated_at) : today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  const genreRoutes = Array.from(genres).map((genre) => ({
    url: `${baseUrl}/?genre=${encodeURIComponent(genre)}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  return [...routes, ...filmRoutes, ...genreRoutes]
}