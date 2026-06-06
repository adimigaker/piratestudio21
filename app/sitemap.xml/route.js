import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const baseUrl = 'https://piratestudio.vercel.app'
  const supabaseUrl = 'https://eogdtpkiwzlarllnxsrj.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ2R0cGtpd3psYXJsbG54c3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODg0NzMsImV4cCI6MjA4OTY2NDQ3M30.eZPbYTuaDerKL9SOEa4ctkxSlU1PiEAU9l42czgYOyI'

  // Ambil semua film
  const filmRes = await fetch(`${supabaseUrl}/rest/v1/PirateStudio21_DB?select=id,updated_at`, {
    headers: { 'apikey': supabaseKey }
  })
  const films = await filmRes.json()

  // Ambil semua genre
  const genreRes = await fetch(`${supabaseUrl}/rest/v1/PirateStudio21_DB?select=genre`, {
    headers: { 'apikey': supabaseKey }
  })
  const genreData = await genreRes.json()

  const genres = new Set()
  genreData.forEach(film => {
    if (film.genre) {
      film.genre.split(',').forEach(g => {
        const trimmed = g.trim()
        if (trimmed) genres.add(trimmed)
      })
    }
  })

  const now = new Date().toISOString()

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

  // Tambahkan film
  for (const film of films) {
    xml += `
  <url>
    <loc>${baseUrl}/play/${film.id}</loc>
    <lastmod>${film.updated_at ? new Date(film.updated_at).toISOString() : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  }

  // Tambahkan genre
  for (const genre of genres) {
    xml += `
  <url>
    <loc>${baseUrl}/?genre=${encodeURIComponent(genre)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
  }

  xml += `
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}