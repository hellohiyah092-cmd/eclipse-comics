'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

const ADMIN_EMAIL = 'hellohiyah092@gmail.com'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session || data.session.user.email !== ADMIN_EMAIL) {
        window.location.href = '/'
      } else {
        setUser(data.session.user)
        loadSubmissions()
      }
    })
  }, [])

  const loadSubmissions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await supabase.from('submissions').update({ status }).eq('id', id)
    loadSubmissions()
  }

  const filtered = submissions.filter(s => s.status === tab)

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"100px 24px 80px" }}>
        <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:5, color:"#cc0000" }}>◆ ADMIN ONLY</span>
        <h1 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:48, color:"#1a1a1a", letterSpacing:-1, margin:"8px 0 32px" }}>EDITOR DASHBOARD</h1>

        {/* Tabs */}
        <div style={{ display:"flex", gap:0, borderBottom:"3px solid #1a1a1a", marginBottom:32 }}>
          {['pending','approved','rejected'].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ background: tab===t ? '#cc0000' : '#fff', color: tab===t ? '#fff' : '#444', border:"2px solid #1a1a1a", borderBottom:"none", fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, letterSpacing:2, textTransform:"uppercase", padding:"12px 24px", cursor:"pointer" }}>
              {t} ({submissions.filter(s=>s.status===t).length})
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily:"Georgia,serif", color:"#666" }}>Loading submissions...</p>
        ) : filtered.length === 0 ? (
          <p style={{ fontFamily:"Georgia,serif", color:"#999", fontSize:16 }}>No {tab} submissions.</p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {filtered.map(sub => (
              <div key={sub.id} style={{ background:"#fff", border:"2px solid #e0d8d0", borderLeft:"5px solid #cc0000", padding:"24px 28px", boxShadow:"4px 4px 0 #eee" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:3, color:"#cc0000", marginBottom:6 }}>{sub.category?.toUpperCase()}</div>
                    <h3 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:22, color:"#1a1a1a", marginBottom:8 }}>{sub.title}</h3>
                    <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#555", lineHeight:1.6, marginBottom:12 }}>{sub.description}</p>
                    <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#999" }}>Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                    {sub.file_url && (
                      <a href={sub.file_url} target="_blank" rel="noreferrer"
                        style={{ display:"inline-block", marginTop:12, fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, color:"#cc0000", letterSpacing:1 }}>
                        📄 VIEW FILE →
                      </a>
                    )}
                  </div>
                  {tab === 'pending' && (
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <button onClick={()=>updateStatus(sub.id,'approved')}
                        style={{ background:"#006600", color:"#fff", border:"2px solid #1a1a1a", fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, letterSpacing:1, padding:"10px 20px", cursor:"pointer", boxShadow:"3px 3px 0 #1a1a1a" }}>
                        ✓ APPROVE
                      </button>
                      <button onClick={()=>updateStatus(sub.id,'rejected')}
                        style={{ background:"#cc0000", color:"#fff", border:"2px solid #1a1a1a", fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, letterSpacing:1, padding:"10px 20px", cursor:"pointer", boxShadow:"3px 3px 0 #1a1a1a" }}>
                        ✕ REJECT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}




