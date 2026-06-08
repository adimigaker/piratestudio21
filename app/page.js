import { supabase } from '@/lib/supabaseClient'
import HomeClient from '@/components/home/HomeClient'

async function getFilmsByGenre(genre, limit = 10, offset = 0, sort = 'update') {
  let query = supabase
    .from('PirateStudio21_DB')
    .select('*')
  
  if (genre && genre !== '') {
    query = query.ilike('genre', `%${genre}%`)
  }
  
  // Sorting
  if (sort === 'update') {
    query = query.order('updated_at', { ascending: false, nullsFirst: false })
  } else {
    query = query.order('year', { ascending: false })
  }
  
  const { data } = await query.range(offset, offset + limit - 1)
  return data || []
}

async function getFilmsCount(genre) {
  let query = supabase
    .from('PirateStudio21_DB')
    .select('*', { count: 'exact', head: true })
  
  if (genre && genre !== '') {
    query = query.ilike('genre', `%${genre}%`)
  }
  
  const { count } = await query
  return count || 0
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
    .order('updated_at', { ascending: false })
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

export default async function Home({ searchParams }) {
  const { genre } = await searchParams
  const activeGenre = genre || ''
  
  const [initialFilms, totalFilms, featured, popular, allGenres] = await Promise.all([
    getFilmsByGenre(activeGenre, 10, 0, 'update'), // default sort by update
    getFilmsCount(activeGenre),
    getFeatured(),
    getPopular(),
    getGenres()
  ])
  
  const randomFeatured = featured.length > 0 
    ? featured[Math.floor(Math.random() * featured.length)]
    : (initialFilms[0] || null)

  return (
    <HomeClient 
      initialFilms={initialFilms}
      totalFilms={totalFilms}
      initialGenres={allGenres}
      featuredFilm={randomFeatured}
      popularFilms={popular}
      initialGenre={activeGenre}
    />
  )
}