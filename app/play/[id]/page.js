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

export async function generateMetadata({ params }) {
  const { id } = await params
  const film = await getFilm(id)

  if (!film) {
    return {
      title: 'Film Tidak Ditemukan - Pirate Studio 21',
      description: 'Film yang Anda cari tidak tersedia.'
    }
  }

  const title = `${film.title} - Sub Indonesia | Streaming & Download Gratis`
  const description = film.synopsis ? film.synopsis.substring(0, 155) : `Nonton streaming ${film.title} subtitle Indonesia.`

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'video.movie',
      url: `https://piratestudio.vercel.app/play/${film.id}`,
      images: film.poster ? [film.poster] : [],
    },
    keywords: `${film.title}, nonton ${film.title}, streaming ${film.title}, download ${film.title}, sub indo`,
  }
}

export default async function PlayPage({ params }) {
  const { id } = await params
  const film = await getFilm(id)

  if (!film) {
    notFound()
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": film.type === 'series' ? "TVSeries" : "Movie",
    "name": film.title,
    "description": film.synopsis || `Nonton streaming ${film.title} subtitle Indonesia.`,
    "datePublished": film.year ? `${film.year}` : undefined,
    "genre": film.genre ? film.genre.split(',').map(g => g.trim()) : undefined,
    "image": film.poster || undefined,
    "aggregateRating": film.rating ? {
      "@type": "AggregateRating",
      "ratingValue": film.rating,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": 1  // ← DITAMBAHKAN
    } : undefined,
    "duration": film.duration || undefined,
    "director": film.director ? {
      "@type": "Person",
      "name": film.director
    } : undefined,
    "productionCompany": film.studio ? {
	  "@type": "Organization",
	  "name": film.studio
	} : undefined
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <PlayerClient film={film} />
    </>
  )
}