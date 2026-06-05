import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import PlayerClient from '@/components/play/PlayerClient'

async function getFilm(id) {
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)
  
  if (!film) {
    notFound()
  }

  return <PlayerClient film={film} />
}