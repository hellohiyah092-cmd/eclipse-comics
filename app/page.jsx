use client'
import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const PANELS = [
  { color:"#cc0000", accent:"#ffcc00", label:"HEROES", icon:"⚡", desc:"Champions of the Eclipse Universe", href:"/browse?cat=heroes" },
  { color:"#1a1aff", accent:"#ff6600", label:"VILLAINS", icon:"💀", desc:"Darkness given purpose and name", href:"/browse?cat=villains" },
  { color:"#8800cc", accent:"#ffcc00", label:"EVENTS", icon:"☄️", desc:"Universe-shaking storylines", href:"/browse?cat=events" },
  { color:"#006600", accent:"#ff3300", label:"SAGAS", icon:"📖", desc:"The grand arcs of Eclipse", href:"/browse?cat=sagas" },
  { color:"#cc6600", accent:"#ffff00", label:"STANDALONE", icon:"📰", desc:"One-shot issues and stories", href:"/browse?cat=standalone" },
  { color:"#005577", accent:"#00ffcc", label:"LORE", icon:"🌐", desc:"The universe bible and deep lore", href:"/browse?cat=lore" },
]

export default function Home() {
  const [hovPanel, setHovPanel] = useState(null)

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />

      {/* HERO */}
      <section style={{ minHeight:"100vh", paddingTop:68, background:"linear-gradient(135deg,#fff8f0,#fff0f0,#f8f0ff)", display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 24px", display:"flex", alignItems:"center", gap:40, flexWrap:"wrap", position:"relative", zIndex:2, width:"100%" }}>
          <div style={{ flex:1, minWidth:300 }}>
            <div style={{ display:"inline-block", fontFamily:"Georgia,serif", fontSize:11, fontWeight:700, letterSpacing:4, color:"#cc0000", borderTop:"2px solid #cc0000", borderBottom:"2px solid #cc0000", padding:"5px 0", marginBottom:24 }}>◆ ECLIPSE UNIVERSE — YEAR ONE ◆</div>
            <h1 style={{ lineHeight:.88, marginBottom:28 }}>
              <span style={{ display:"block", fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(52px,9vw,96px)", color:"#1a1a1a", letterSpacing:-1 }}>THE</span>
              <span style={{ display:"block", fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(68px,13vw,140px)", color:"#cc0000", letterSpacing:-2, textShadow:"5px 5px 0 #880000" }}>SHADOW</span>
              <span style={{ display:"block", fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(32px,6vw,60px)", color:"#ff6600", letterSpacing:-0.5 }}>HAS A NAME.</span>
            </h1>
            <div style={{ background:"#fff", border:"3px solid #1a1a1a", borderRadius:"16px 16px 16px 4px", padding:"16px 20px", maxWidth:440, boxShadow:"5px 5px 0 #cc0000", marginBottom:32, position:"relative" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:15, lineHeight:1.6 }}>Eclipse Comics is a <strong>collaborative universe</strong> — built by creators, curated by one editor, alive with every new submission.</p>
              <div style={{ position:"absolute", bottom:-18, left:20, width:0, height:0, borderLeft:"9px solid transparent", borderRight:"9px solid transparent", borderTop:"18px solid #1a1a1a" }} />
            </div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <a href="/browse" style={{ background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:15, fontWeight:900, letterSpacing:2, padding:"12px 28px", textDecoration:"none", boxShadow:"5px 5px 0 #1a1a1a", clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" }}>📚 READ NOW</a>
              <a href="/submit" style={{ background:"#ffcc00", color:"#1a1a1a", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:15, fontWeight:900, letterSpacing:2, padding:"12px 28px", textDecoration:"none", boxShadow:"5px 5px 0 #1a1a1a", clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" }}>✏️ SUBMIT WORK</a>
            </div>
          </div>
          <div style={{ flex:1, minWidth:280, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:280, height:280, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ position:"absolute", inset:0, border:"2px solid rgba(204,0,0,0.2)", borderRadius:"50%" }} />
              <div style={{ position:"absolute", inset:22, border:"3px solid #cc0000", borderRadius:"50%", borderTopColor:"transparent", borderLeftColor:"transparent" }} />
              <div style={{ width:140, height:140, borderRadius:"50%", background:"radial-gradient(circle at 35% 30%,#ff4444,#990000)", border:"4px solid #1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(204,0,0,0.5),6px 6px 0 #1a1a1a" }}>
                <span style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:75, color:"#ffcc00", textShadow:"3px 3px 0 #880000" }}>E</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:"#cc0000", display:"flex", justifyContent:"center", flexWrap:"wrap" }}>
        {[{v:"∞",l:"Stories to Tell"},{v:"1",l:"Curating Editor"},{v:"6",l:"Categories"},{v:"You",l:"Could Be Next"}].map((s,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 40px", borderRight:i<3?"1px solid rgba(0,0,0,0.2)":"none" }}>
            <span style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:34, color:"#fff" }}>{s.v}</span>
            <span style={{ fontFamily:"Georgia,serif", fontSize:10, letterSpacing:3, color:"rgba(255,255,255,.75)", marginTop:4, textTransform:"uppercase" }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* PANELS */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"100px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:5, color:"#cc0000", display:"block", marginBottom:12 }}>◆ THE ECLIPSE UNIVERSE</span>
          <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(32px,5vw,56px)", color:"#1a1a1a", marginBottom:12 }}>ALWAYS EXPANDING</h2>
          <div style={{ width:60, height:4, background:"#cc0000", margin:"0 auto" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:20 }}>
          {PANELS.map((p,i) => (
            <a key={i} href={p.href}
              style={{ padding:"28px 20px", background:p.color, border:"3px solid #1a1a1a", position:"relative", overflow:"hidden", cursor:"pointer", textDecoration:"none", display:"block", clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))", boxShadow: hovPanel===i ? `8px 8px 0 #111` : "6px 6px 0 #111", transform: hovPanel===i ? "translateY(-8px)" : "none", transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={() => setHovPanel(i)} onMouseLeave={() => setHovPanel(null)}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:p.accent }} />
              <div style={{ fontSize:40, marginBottom:10 }}>{p.icon}</div>
              <div style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:20, letterSpacing:3, color:p.accent, marginBottom:8 }}>{p.label}</div>
              <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5, marginBottom:18 }}>{p.desc}</p>
              <div style={{ display:"inline-block", border:`2px solid ${p.accent}`, color:p.accent, fontFamily:"Georgia,serif", fontWeight:700, fontSize:10, letterSpacing:3, padding:"4px 10px" }}>UPDATES UNDERWAY</div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"100px 24px", textAlign:"center", background:"linear-gradient(135deg,#fff8f0,#fff0f0)" }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(44px,8vw,88px)", color:"#1a1a1a", letterSpacing:-2, marginBottom:16, lineHeight:.92 }}>YOUR STORY<br/>BELONGS HERE.</h2>
        <p style={{ fontFamily:"Georgia,serif", fontSize:18, color:"#666", marginBottom:40 }}>Register. Submit. Become part of the Eclipse universe.</p>
        <a href="/auth" style={{ background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:18, fontWeight:900, letterSpacing:2, padding:"18px 48px", textDecoration:"none", boxShadow:"5px 5px 0 #1a1a1a", clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" }}>JOIN ECLIPSE COMICS →</a>
      </section>

      <Footer />
    </main>
  )
}
