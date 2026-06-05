'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.slice(0, 6));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar" id="navbar">
      <a href="/" className="logo">
        <span className="brand-pirate">PIRATE</span>
        <span className="brand-studio">STUDIO</span>
        <span className="brand-num">21</span>
      </a>
      
      <div className="search-wrap">
        <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input 
            type="text" 
            className="search-input"
            placeholder="Cari judul film..." 
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        />
        
        {showDropdown && searchResults.length > 0 && (
          <div className="search-dropdown show">
            {searchResults.map((film) => (
              <a key={film.id} href={`/play/${film.id}`} className="search-item">
                {film.poster && <img src={film.poster} className="search-item-poster" alt={film.title} />}
                <div className="search-item-info">
                  <div className="search-item-title">{film.title}</div>
                  <div className="search-item-meta">
                    <span>{film.year || '—'}</span>
                    <span className="search-item-type">{film.type || 'movie'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}