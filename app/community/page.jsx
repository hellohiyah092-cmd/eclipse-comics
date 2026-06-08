'use client'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function CommunityPage() {
  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'120px 24px 80px' }}>
        <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:5, color:'#cc0000' }}>◆ COMMUNITY</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(36px,6vw,64px)', color:'#1a1a1a', letterSpacing:-1, margin:'8px 0 16px' }}>THE COMMUNITY</h1>
        <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#666', lineHeight:1.7, maxWidth:600, marginBottom:60 }}>React to issues, leave comments and share your thoughts on the Eclipse universe. Every published issue has its own comment section.</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
          {[
            { icon:'💬', title:'COMMENTS', desc:'Every published issue has a comment section. Read an issue and share your thoughts directly on the page.' },
            { icon:'⚡', title:'REACTIONS', desc:'React to issues with emojis — heart, fire, shock and more. Show creators how their work landed.' },
            { icon:'📢', title:'DISCUSSIONS', desc:'Debate the lore, predict what happens next and connect with other Eclipse readers.' },
          ].map((c,i) => (
            <div key={i} style={{ background:'#fff', border:'3px solid #1a1a1a', padding:'32px 28px', boxShadow:'6px 6px 0 #cc0000' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>{c.icon}</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:20, letterSpacing:3, color:'#cc0000', marginBottom:12 }}>{c.title}</h3>
              <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#666', lineHeight:1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop:60, background:'#cc0000', padding:'48px 40px', border:'3px solid #1a1a1a', boxShadow:'6px 6px 0 #1a1a1a', textAlign:'center' }}>
          <h2 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:32, color:'#fff', marginBottom:12 }}>START READING</h2>
          <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(255,255,255,0.8)', marginBottom:28 }}>Head to the Browse page to find an issue and join the conversation.</p>
          <a href='/browse' style={{ background:'#ffcc00', color:'#1a1a1a', border:'3px solid #1a1a1a', fontFamily:'Georgia,serif', fontSize:15, fontWeight:900, letterSpacing:2, padding:'14px 36px', textDecoration:'none', boxShadow:'4px 4px 0 #1a1a1a' }}>BROWSE ISSUES →</a>
        </div>
      </div>
      <Footer />
    </main>
  )
}
