import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap() {
  const baseUrl = 'https://piratestudio.vercel.app'
  const today = new Date()
  
  // Ambil semua film dari database
  const { data: films } = await supabase
    .from('PirateStudio21_DB')
    .select('id, updated_at')
    .order('id')
  
  // Ambil semua genre unik
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
  const filmRoutes = (films || []).map((film) => ({
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