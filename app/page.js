import { supabase } from '@/lib/supabaseClient'
import HomeClient from '@/components/home/HomeClient'

async function getFilms() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .order('year', { ascending: false })
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
    .limit(8)
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
  const [films, featured, popular, genres] = await Promise.all([
    getFilms(),
    getFeatured(),
    getPopular(),
    getGenres()
  ])
  
  const randomFeatured = featured.length > 0 
    ? featured[Math.floor(Math.random() * featured.length)]
    : null

  return (
    <HomeClient 
      initialFilms={films} 
      initialGenres={genres}
      featuredFilm={randomFeatured}
      popularFilms={popular}
    />
  )
}