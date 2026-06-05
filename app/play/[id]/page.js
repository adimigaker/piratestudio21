import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

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

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <h1>{film.title}</h1>
      <p>ID: {film.id}</p>
      <p>Type: {film.type}</p>
      {film.embed_url && (
        <iframe 
          src={film.embed_url} 
          width="100%" 
          height="400" 
          style={{ border: 'none' }}
          allowFullScreen
        />
      )}
      <a href="/">← Kembali</a>
    </div>
  )
}