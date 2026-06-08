import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const offset = parseInt(searchParams.get('offset') || '0')
  const limit = parseInt(searchParams.get('limit') || '10')
  const genre = searchParams.get('genre')
  const sort = searchParams.get('sort') || 'update'
  
  let query = supabase
    .from('PirateStudio21_DB')
    .select('*')
  
  if (genre) {
    query = query.ilike('genre', `%${genre}%`)
  }
  
  // Sorting berdasarkan pilihan
  if (sort === 'update') {
    query = query.order('updated_at', { ascending: false, nullsFirst: false })
  } else {
    query = query.order('year', { ascending: false })
  }
  
  if (!genre) {
    query = query.range(offset, offset + limit - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data || [])
}