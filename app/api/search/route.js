import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 2) {
    return Response.json([]);
  }
  
  const { data } = await supabase
    .from('PirateStudio21_DB')
    .select('id, title, year')
    .ilike('title', `%${q}%`)
    .limit(10);
  
  return Response.json(data || []);
}
