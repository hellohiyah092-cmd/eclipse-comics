
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function LeaderboardPage() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('likes')

  useEffect(() => {
    loadCreators()
  }, [filter])

  const loadCreators = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_creator', true)
      .order(filter, { ascending: false })
      .limit(50)
    setCreators(data || [])
    setLoading(false)
  }

  const MEDALS = ['🥇','🥈','🥉']

  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />

      <div style={{ background:'#1a1a1a', padding:'80px 24px 48px', borderBottom:'4px solid #ffcc00' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:5, color:'#ffcc00' }}>◆ CREATOR RANKINGS</span>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(36px,6vw,64px)', color:'#f5f0e8', letterSpacing:-1, textShadow:'4px 4px 0 #ffcc00', margin:'8px 0 16px' }}>LEADERBOARD</h1>
          <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>The top creators in the Eclipse universe ranked by the community.</p>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 24px' }}>
        {/* Filter */}
        <div style={{ display:'flex', gap:8, marginBottom:32 }}>
          {[['likes','👍 Most Liked'],['dislikes','👎 Most Disliked']].map(([val,label]) => (
            <button key={val} onClick={()=>setFilter(val)}
              style={{ background: filter===val ? '#cc0000' : '#fff', color: filter===val ? '#fff' : '#444', border:'2px solid #cc0000', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, letterSpacing:1, padding:'10px 20px', cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily:'Georgia,serif', color:'#999' }}>Loading rankings...</p>
        ) : creators.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#999' }}>No creators ranked yet. Be the first to join!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {creators.map((creator, i) => (
              <a key={creator.id} href={`/profile/${creator.id}`}
                style={{ display:'flex', alignItems:'center', gap:20, padding:'20px 24px', background:'#fff', border:'2px solid #e0d8d0', borderLeft: i < 3 ? '5px solid #ffcc00' : '5px solid #e0d8d0', textDecoration:'none', boxShadow:'4px 4px 0 #eee' }}>
                <div style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:28, color: i < 3 ? '#ffcc00' : '#ccc', width:40, textAlign:'center', flexShrink:0 }}>
                  {i < 3 ? MEDALS[i] : `#${i+1}`}
                </div>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'radial-gradient(circle,#ff4444,#990000)', border:'3px solid #cc0000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:20, color:'#ffcc00' }}>
                    {(creator.username || creator.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:18, color:'#1a1a1a', marginBottom:4 }}>{creator.username || 'Unnamed Creator'}</h3>
                  <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#888' }}>{creator.bio?.slice(0,80) || 'Eclipse Comics creator'}</p>
                </div>
                <div style={{ display:'flex', gap:12, flexShrink:0 }}>
                  <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:14, color:'#006600' }}>👍 {creator.likes || 0}</span>
                  <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:14, color:'#cc0000' }}>👎 {creator.dislikes || 0}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}




