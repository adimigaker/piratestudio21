import { NextResponse } from 'next/server'

export async function GET() {
  // Redirect ke API sitemap
  const apiUrl = new URL('/api/sitemap', 'https://piratestudio.vercel.app')
  const response = await fetch(apiUrl)
  const xml = await response.text()
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}