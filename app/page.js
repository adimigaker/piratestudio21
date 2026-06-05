import { supabase } from '@/lib/supabaseClient'
import HomeClient from '@/components/home/HomeClient'

async function getFilmsCount() {
  const { count, error } = await supabase
    .from('PirateStudio21_DB')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}

async function getFilms(limit = 10, offset = 0) {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .order('year', { ascending: false })
    .range(offset, offset + limit - 1)
  return data || []
}

async function getFeatured() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('featured', true)
  return data || []
}

async function getPopular() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('popular', true)
    .limit(10)
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
      film.genre.split(',').forEach(g => {
        const trimmed = g.trim()
        if (trimmed !== '') {
          genreSet.add(trimmed)
        }
      })
    }
  }
  return Array.from(genreSet).sort()
}

export default async function Home() {
  const [initialFilms, totalFilms, featured, popular, genres] = await Promise.all([
    getFilms(10, 0),  // 10 film pertama untuk initial load
    getFilmsCount(),
    getFeatured(),
    getPopular(),
    getGenres()
  ])
  
  const randomFeatured = featured.length > 0 
    ? featured[Math.floor(Math.random() * featured.length)]
    : null

  return (
    <HomeClient 
      initialFilms={initialFilms}
      totalFilms={totalFilms}
      initialGenres={genres}
      featuredFilm={randomFeatured}
      popularFilms={popular}
    />
  )
}