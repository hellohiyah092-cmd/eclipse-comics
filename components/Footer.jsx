export default function Footer() {
  return (
    <footer style={{ borderTop: '4px solid #cc0000', padding: '60px 24px 32px', background: '#1a1a1a', textAlign: 'center' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 4, textDecoration: 'none', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Georgia,serif', fontSize: 34, fontWeight: 900, color: '#cc0000' }}>E</span>
        <span style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 900, color: '#f5f0e8', letterSpacing: 4 }}>CLIPSE</span>
        <span style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: '#cc0000', letterSpacing: 5, marginLeft: 4, alignSelf: 'flex-end', paddingBottom: 2 }}>COMICS</span>
      </a>
      <p style={{ fontFamily: 'Georgia,serif', fontSize: 15, color: '#cc0000', fontStyle: 'italic', marginTop: 8, marginBottom: 32 }}>"The Shadow Has A Name."</p>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {[['Home','/'],['Browse','/browse'],['Submit','/submit'],['Community','/community'],['Collaborate','/collaborate'],['Lore','/lore'],['Dashboard','/dashboard'],['Leaderboard','/leaderboard'],].map(([label,href]) => (
          <a key={label} href={href} style={{ fontFamily: 'Georgia,serif', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#666', textDecoration: 'none', padding: '4px 12px' }}>{label}</a>
        ))}
      </div>
      <div style={{ width: 60, height: 3, background: '#cc0000', margin: '0 auto 24px' }} />
      <p style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: '#444', letterSpacing: 1 }}>© 2026 Eclipse Comics. All stories curated and approved by the Eclipse editor. All rights reserved.</p>
    </footer>
  )
}
