export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#0a0a0f', 
      borderTop: '1px solid #1a1a2e', 
      padding: '40px 20px 20px',
      marginTop: '50px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        
        <div>
          <h3 style={{ color: '#e50914', marginBottom: '15px' }}>PirateStudio 21</h3>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
            Kami tidak menyimpan file video. Semua konten di-embed dari penyedia pihak ketiga.
          </p>
        </div>
        
        <div>
          <h3 style={{ color: '#e50914', marginBottom: '15px' }}>Disclaimer</h3>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
            Pirate Studio 21 adalah situs pengindeks embed video dari penyedia pihak ketiga. 
            Kami tidak bertanggung jawab atas konten yang dihosting oleh pihak eksternal.
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #1a1a2e' }}>
        <p style={{ color: '#666', fontSize: '12px' }}>
          © 2025 Pirate Studio 21 · Untuk tujuan edukasi dan hiburan
        </p>
      </div>
    </footer>
  );
}
