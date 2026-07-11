import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.trim() === '') {
    return Response.json([])
  }

  const searchTerm = `%${q.toLowerCase()}%`

  const { data, error } = await supabase
    .from('PirateStudio21_DB')
    .select('id, slug, title, year, poster, type, rating, genre')  // ← PASTIKAN slug DAN type ADA
    .ilike('title', searchTerm)
    .limit(10)

  if (error) {
    console.error('Search API error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Filter data yang tidak punya slug
  const validData = data.filter(film => film.slug && film.id)

  return Response.json(validData || [])
}