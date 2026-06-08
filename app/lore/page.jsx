'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function LorePage() {
  const [lore, setLore] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    loadLore()
  }, [])

  const loadLore = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('issues')
      .select('*')
      .eq('category', 'lore')
      .eq('published', true)
      .order('title', { ascending: true })
    setLore(data || [])
    setLoading(false)
  }

  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />
      <div style={{ background:'#1a1a1a', padding:'80px 24px 48px', borderBottom:'4px solid #005577' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:5, color:'#00ffcc' }}>◆ UNIVERSE BIBLE</span>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(36px,6vw,64px)', color:'#f5f0e8', letterSpacing:-1, textShadow:'4px 4px 0 #005577', margin:'8px 0 16px' }}>LORE</h1>
          <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.7, maxWidth:600 }}>The deep knowledge of the Eclipse Universe — history, factions, powers and secrets.</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px' }}>
        {loading ? (
          <p style={{ fontFamily:'Georgia,serif', color:'#999' }}>Loading...</p>
        ) : lore.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <p style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#999' }}>The lore vault is being filled. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
            {lore.map(item => (
              <div key={item.id}
                style={{ background:'#fff', border:'2px solid #e0d8d0', borderTop:'4px solid #005577', padding:'28px 24px', boxShadow:'4px 4px 0 #eee', cursor:'pointer' }}
                onClick={() => window.location.href = `/read/${item.id}`}>
                <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#005577', marginBottom:8 }}>LORE ENTRY</div>
                <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:20, color:'#1a1a1a', marginBottom:12 }}>{item.title}</h3>
                <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#666', lineHeight:1.6, marginBottom:20 }}>{item.summary?.slice(0,120)}...</p>
                <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, color:'#005577', letterSpacing:1 }}>READ MORE →</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

