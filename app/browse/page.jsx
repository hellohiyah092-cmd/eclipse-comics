



'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

const CATEGORIES = [
  { id:"heroes", label:"HEROES", color:"#cc0000", accent:"#ffcc00", icon:"⚡" },
  { id:"villains", label:"VILLAINS", color:"#1a1aff", accent:"#ff6600", icon:"💀" },
  { id:"events", label:"EVENTS", color:"#8800cc", accent:"#ffcc00", icon:"☄️" },
  { id:"sagas", label:"SAGAS", color:"#006600", accent:"#ff3300", icon:"📖" },
  { id:"standalone", label:"STANDALONE ISSUES", color:"#cc6600", accent:"#ffff00", icon:"📰" },
  { id:"lore", label:"LORE / UNIVERSE BIBLE", color:"#005577", accent:"#00ffcc", icon:"🌐" },
]

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function BrowsePage() {
  const [activeCat, setActiveCat] = useState('heroes')
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [alpha, setAlpha] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const cat = CATEGORIES.find(c => c.id === activeCat)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const catParam = params.get('cat')
    if (catParam) setActiveCat(catParam)
  }, [])

  useEffect(() => {
    loadIssues()
  }, [activeCat])

  const loadIssues = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('issues')
      .select('*')
      .eq('category', activeCat)
      .eq('published', true)
      .order('title', { ascending: true })
    setIssues(data || [])
    setLoading(false)
  }

  const filtered = issues.filter(i => {
    const ms = i.title.toLowerCase().includes(search.toLowerCase())
    const ma = alpha === 'ALL' || i.title.toUpperCase().startsWith(alpha)
    return ms && ma
  })

  const grouped = {}
  filtered.forEach(i => {
    const l = i.title[0].toUpperCase()
    if (!grouped[l]) grouped[l] = []
    grouped[l].push(i)
  })

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />

      {/* Header */}
      <div style={{ background:"#1a1a1a", padding:"80px 24px 0", borderBottom:"4px solid #cc0000" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:5, color:"#cc0000" }}>◆ THE ECLIPSE LIBRARY</span>
          <h1 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(36px,6vw,64px)", color:"#f5f0e8", letterSpacing:-1, textShadow:"4px 4px 0 #cc0000", margin:"8px 0 24px" }}>BROWSE</h1>
          <div style={{ display:"flex", overflowX:"auto", flexWrap:"wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c.id}
                style={{ background: activeCat===c.id ? c.color : "transparent", color: activeCat===c.id ? "#fff" : "#888", border:"none", borderBottom: activeCat===c.id ? `4px solid ${c.accent}` : "4px solid transparent", fontFamily:"Georgia,serif", fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", padding:"14px 18px", whiteSpace:"nowrap", transition:"all .2s" }}
                onClick={() => { setActiveCat(c.id); setSearch(''); setAlpha('ALL') }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px", display:"flex", gap:32, alignItems:"flex-start", flexWrap:"wrap" }}>

        {/* Sidebar */}
        <div style={{ width:220, flexShrink:0 }}>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:3, color:"#cc0000", display:"block", marginBottom:8 }}>SEARCH</label>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${cat?.label.toLowerCase()}…`}
              style={{ width:"100%", padding:"10px 14px", fontFamily:"Georgia,serif", fontSize:14, border:"2px solid #ddd", borderTop:`3px solid ${cat?.color}`, outline:"none", boxShadow:"3px 3px 0 #eee" }} />
          </div>
          <div>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:3, color:"#cc0000", display:"block", marginBottom:8 }}>FILTER A–Z</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {["ALL",...ALPHABET].map(l => (
                <button key={l} onClick={()=>setAlpha(l)}
                  style={{ padding:"5px 6px", fontFamily:"Georgia,serif", fontSize:11, fontWeight:700, border:`2px solid ${alpha===l ? cat?.color : "#ddd"}`, background: alpha===l ? cat?.color : "#fff", color: alpha===l ? "#fff" : "#666", cursor:"pointer", minWidth: l==="ALL"?36:28 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main list */}
        <div style={{ flex:1, minWidth:280 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24, paddingBottom:12, borderBottom:"2px solid #e0d8d0" }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#666" }}>
              {filtered.length} titles in <strong style={{color:cat?.color}}>{cat?.label}</strong>
            </span>
            {(search||alpha!=='ALL') && (
              <button onClick={()=>{setSearch('');setAlpha('ALL')}} style={{ background:"none", border:"none", fontFamily:"Georgia,serif", fontSize:12, color:"#cc0000", cursor:"pointer", fontWeight:700 }}>✕ CLEAR</button>
            )}
          </div>

          {loading ? (
            <p style={{ fontFamily:"Georgia,serif", color:"#999", padding:"40px 0" }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <div style={{ padding:"60px 0", textAlign:"center" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:16, color:"#999" }}>No titles here yet. The universe is still expanding.</p>
            </div>
          ) : (
            Object.keys(grouped).sort().map(letter => (
              <div key={letter} style={{ marginBottom:32 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <span style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:30, color:cat?.color }}>{letter}</span>
                  <div style={{ flex:1, height:2, background:"#e0d8d0" }} />
                </div>
                {grouped[letter].map(issue => (
                  <a key={issue.id} href={`/read/${issue.id}`}
                    style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", background:"#fff", border:"2px solid #e0d8d0", borderLeft:`5px solid ${cat?.color}33`, marginBottom:8, textDecoration:"none", boxShadow:"3px 3px 0 #eee" }}>
                    <div style={{ width:42, height:42, background:`linear-gradient(135deg,${cat?.color},${cat?.accent})`, border:"2px solid #1a1a1a", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{cat?.icon}</div>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:17, color:"#1a1a1a", marginBottom:4 }}>{issue.title}</h3>
                      <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#888" }}>{issue.issue_number} · {issue.summary?.slice(0,80)}{issue.summary?.length>80?'…':''}</p>
                    </div>
                    <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, color:cat?.color, letterSpacing:1, flexShrink:0 }}>READ →</span>
                  </a>
                ))}
              </div>
            ))
          )}

          <div style={{ marginTop:40, padding:"24px", background:"#fff8f0", border:"2px dashed #e0c8b0", textAlign:"center" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#999", lineHeight:1.7 }}>
              ✦ More titles added as the editor approves new submissions. Check back regularly.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}