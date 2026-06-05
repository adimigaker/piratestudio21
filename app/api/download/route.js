import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }
  
  try {
    // Ambil file subtitle dari external URL
    const response = await fetch(url)
    const content = await response.text()
    
    // Ambil nama file dari URL
    const filename = url.split('/').pop() || 'subtitle.vtt'
    
    // Kembalikan sebagai file download
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/vtt',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}