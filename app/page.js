import { supabase } from '@/lib/supabaseClient'
import HomeClient from '@/components/home/HomeClient'

async function getFilms() {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .order('year', { ascending: false })
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

export default async function Home() {
  const films = await getFilms()
  const genres = await getGenres()
  
  return <HomeClient initialFilms={films} initialGenres={genres} />
}