'use client';

import { useState } from 'react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      // Fetch search results dari API
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.slice(0, 6));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <nav style={{ 
      backgroundColor: '#0a0a0f', 
      padding: '15px 20px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      borderBottom: '1px solid #1a1a2e'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#e50914', fontWeight: 'bold', fontSize: '24px' }}>PIRATE</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>STUDIO</span>
          <span style={{ color: '#e50914', fontSize: '18px' }}>21</span>
        </a>

        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Cari judul film..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '10px 15px',
              backgroundColor: '#1a1a2e',
              border: '1px solid #2a2a3a',
              borderRadius: '8px',
              color: 'white',
              outline: 'none'
            }}
          />
          
          {/* Dropdown hasil pencarian */}
          {showDropdown && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#1a1a2e',
              border: '1px solid #2a2a3a',
              borderRadius: '8px',
              marginTop: '5px',
              zIndex: 1001
            }}>
              {searchResults.map((film) => (
                <a
                  key={film.id}
                  href={`/play/${film.id}`}
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '1px solid #2a2a3a'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a3a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {film.title} ({film.year})
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
