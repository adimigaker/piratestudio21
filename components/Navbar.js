'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      <a href="/" className="logo" style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
        <span className="brand-pirate" style={{ color: '#e50914', fontWeight: 'bold' }}>PIRATE</span>
        <span className="brand-studio" style={{ color: '#e8e8f0', fontWeight: 'bold' }}>STUDIO</span>
        <span className="brand-num" style={{ color: '#e8e8f0', opacity: 0.7, fontWeight: 'bold' }}>21</span>
      </a>
      
      <div className="search-wrap" style={{ position: 'relative' }}>
        <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input 
          type="text" 
          className={`search-input ${isFocused ? 'focused' : ''}`}
          placeholder="Cari judul film..." 
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          style={{
            width: isFocused ? '260px' : '200px',
            transition: 'width 0.3s ease'
          }}
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