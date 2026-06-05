import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

// =============================================
// AMBIL DATA FILM DARI SUPABASE (Server Component)
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
// CLIENT COMPONENT (INTERAKTIF)
// =============================================
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Fungsi mergeEpisodes (copy persis dari player.js website lama)
function mergeEpisodes(film) {
    function parseCol(val) {
        if (!val) return [];
        if (typeof val === 'string') {
            try { var p = JSON.parse(val); return Array.isArray(p) ? p : []; }
            catch(e) { return []; }
        }
        return Array.isArray(val) ? val : [];
    }

    var embeds    = parseCol(film.embed_url);
    var downloads = parseCol(film.download_url);
    var mirrors   = parseCol(film.mirror_url);
    var subtitles = parseCol(film.subtitle_url);

    // Kalau embed_url sudah format lama (punya semua field), pakai langsung
    if (embeds.length > 0 && embeds[0].download !== undefined) {
        return embeds;
    }

    // Format baru — merge berdasarkan ep number
    var map = {};

    embeds.forEach(function(e) {
        var n = e.ep;
        if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' };
        map[n].embed = e.embed || '';
    });
    downloads.forEach(function(e) {
        var n = e.ep;
        if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' };
        map[n].download = e.download || '';
    });
    mirrors.forEach(function(e) {
        var n = e.ep;
        if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' };
        map[n].mirror = e.mirror || '';
    });
    subtitles.forEach(function(e) {
        var n = e.ep;
        if (!map[n]) map[n] = { ep: n, embed: '', download: '', mirror: '', subtitle: '' };
        map[n].subtitle = e.subtitle || '';
    });

    // Sort by ep number
    return Object.values(map).sort(function(a, b) { return a.ep - b.ep; });
}

function PlayerClient({ initialFilm }) {
    const searchParams = useSearchParams()
    const [currentFilm, setCurrentFilm] = useState(initialFilm)
    const [episodes, setEpisodes] = useState([])
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const [trailerMode, setTrailerMode] = useState(false)

    // Inisialisasi data series (mirip dengan loadPlayer di player.js)
    useEffect(() => {
        if (currentFilm.type === 'series') {
            const mergedEpisodes = mergeEpisodes(currentFilm)
            setEpisodes(mergedEpisodes)
            
            const episodeParam = searchParams.get('ep')
            let targetEpisode = null
            if (episodeParam && mergedEpisodes.length) {
                targetEpisode = mergedEpisodes.find(ep => ep.ep === parseInt(episodeParam))
            }
            setCurrentEpisode(targetEpisode || mergedEpisodes[0] || null)
        }
        setTrailerMode(!!currentFilm.trailer)
    }, [currentFilm, searchParams])

    // Fungsi untuk mengganti episode
    const changeEpisode = (ep) => {
        setTrailerMode(false)
        setCurrentEpisode(ep)
        // Update URL tanpa reload
        const url = new URL(window.location.href)
        url.searchParams.set('ep', ep.ep)
        window.history.pushState({}, '', url)
    }

    // Fungsi untuk beralih ke trailer atau film
    const switchTab = (tab) => {
        if (tab === 'trailer') {
            setTrailerMode(true)
        } else {
            setTrailerMode(false)
        }
    }

    // Tentukan URL yang akan diputar
    let activeUrl = ''
    if (trailerMode && currentFilm.trailer) {
        activeUrl = currentFilm.trailer
    } else if (currentFilm.type === 'series' && currentEpisode) {
        activeUrl = currentEpisode.embed
    } else {
        activeUrl = typeof currentFilm.embed_url === 'string' ? currentFilm.embed_url : ''
    }

    const hasTrailer = !!currentFilm.trailer
    const isSeries = currentFilm.type === 'series'

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <a href="/" className="back-btn">← Kembali ke Home</a>

            <div className="player-wrapper" style={{ marginTop: '20px' }}>
                <div className="player-aspect">
                    {activeUrl ? (
                        <iframe 
                            src={activeUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                            allowFullScreen
                        />
                    ) : (
                        <div className="player-loading">Embed URL belum tersedia</div>
                    )}
                </div>
            </div>

            {/* Tab Bar (Trailer & Episode) */}
            {(hasTrailer || isSeries) && (
                <div className="server-bar" style={{ marginTop: '16px' }}>
                    <span className="server-label">📺</span>
                    {hasTrailer && (
                        <button 
                            className={`server-btn ${trailerMode ? 'active' : ''}`}
                            onClick={() => switchTab('trailer')}
                        >
                            🎬 Trailer
                        </button>
                    )}
                    {isSeries && (
                        <button 
                            className={`server-btn ${!trailerMode ? 'active' : ''}`}
                            onClick={() => switchTab('film')}
                        >
                            📺 Full Series
                        </button>
                    )}
                    {!isSeries && !hasTrailer && (
                         <button className="server-btn active">🎥 Film</button>
                    )}
                </div>
            )}

            {/* Daftar Episode (hanya tampil jika series dan bukan mode trailer) */}
            {isSeries && !trailerMode && episodes.length > 0 && (
                <div className="server-bar" style={{ justifyContent: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                    {episodes.map((ep) => (
                        <button
                            key={ep.ep}
                            className={`episode-btn ${currentEpisode?.ep === ep.ep ? 'active' : ''}`}
                            onClick={() => changeEpisode(ep)}
                        >
                            Ep {ep.ep}
                        </button>
                    ))}
                </div>
            )}

            {/* Info Film */}
            <h1 className="info-title">
                {currentFilm.title} ({currentFilm.year})
                {isSeries && <span style={{ color: '#e50914', fontSize: '0.6em', marginLeft: '10px' }}>SERIES</span>}
            </h1>

            {currentFilm.synopsis && (
                <div className="info-synopsis">
                    <div className="info-synopsis-label">Sinopsis</div>
                    <p>{currentFilm.synopsis}</p>
                </div>
            )}

            <div className="action-buttons">
                {currentFilm.download_url && (
                    <a href={currentFilm.download_url} target="_blank" className="btn-action btn-action-download">
                        ⬇️ Download
                    </a>
                )}
                {currentFilm.subtitle_url && (
                    <a href={currentFilm.subtitle_url} target="_blank" className="btn-action">
                        📝 Subtitle
                    </a>
                )}
            </div>
        </div>
    )
}

// =============================================
// MAIN PAGE COMPONENT
// =============================================
export default async function PlayPage({ params }) {
    const { id } = await params
    const film = await getFilm(id)
    
    if (!film) {
        notFound()
    }

    return <PlayerClient initialFilm={film} />
}