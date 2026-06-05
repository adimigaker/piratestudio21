import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import PlayerClient from './PlayerClient'

// =============================================
// SERVER COMPONENT: Ambil data dari Supabase
// =============================================
async function getFilm(id) {
  const { data, error } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error || !data) return null
  return data
}

// =============================================
// MAIN PAGE
// =============================================
export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  
  if (!film) {
    notFound()
  }

  // Kirim data film ke Client Component
  return <PlayerClient film={film} />
}