'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function SubmitPage() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('heroes')
  const [description, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = '/auth'
      else setUser(data.session.user)
    })
  }, [])

  const handleSubmit = async () => {
    if (!title || !file) { setMsg('Please fill in all fields and attach a file.'); return }
    setLoading(true)
    setMsg('')
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('submissions')
        .insert({ user_id: user.id, title, category, description, file_url: urlData.publicUrl, status: 'pending' })
      if (dbError) throw dbError

      setMsg('✅ Submission sent! The editor will review it shortly.')
      setTitle(''); setCategory('heroes'); setDesc(''); setFile(null)
    } catch (err) {
      setMsg('Something went wrong: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"120px 24px 80px" }}>
        <div style={{ marginBottom:40 }}>
          <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:5, color:"#cc0000" }}>◆ SUBMIT YOUR WORK</span>
          <h1 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(32px,6vw,56px)", color:"#1a1a1a", letterSpacing:-1, marginTop:8 }}>SEND IT IN.</h1>
          <p style={{ fontFamily:"Georgia,serif", fontSize:16, color:"#666", lineHeight:1.7, marginTop:12 }}>Your work must be fully finished — written, inked and coloured. The editor reviews every submission personally before anything goes live.</p>
        </div>

        <div style={{ background:"#fff", border:"3px solid #1a1a1a", boxShadow:"8px 8px 0 #cc0000", padding:"40px" }}>
          {/* Title */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>TITLE OF YOUR SUBMISSION</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. The Ashen Knight #7" style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none" }} />
          </div>

          {/* Category */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>CATEGORY</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none", background:"#fff" }}>
              <option value="heroes">Heroes</option>
              <option value="villains">Villains</option>
              <option value="events">Events</option>
              <option value="sagas">Sagas</option>
              <option value="standalone">Standalone Issue</option>
              <option value="lore">Lore / Universe Bible</option>
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>BRIEF DESCRIPTION (NO SPOILERS)</label>
            <textarea value={description} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="A short summary of what this issue or chapter is about..." style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none", resize:"vertical" }} />
          </div>

          {/* File upload */}
          <div style={{ marginBottom:32 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>ATTACH YOUR FILE (PDF OR WORD DOC)</label>
            <div style={{ border:"2px dashed #cc0000", padding:"32px", textAlign:"center", background:"#fff8f0" }}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setFile(e.target.files[0])} style={{ fontFamily:"Georgia,serif", fontSize:14 }} />
              <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#999", marginTop:12 }}>Accepted: PDF, DOC, DOCX — Max 50MB</p>
              {file && <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#cc0000", fontWeight:700, marginTop:8 }}>✓ {file.name}</p>}
            </div>
          </div>

          {msg && <p style={{ fontFamily:"Georgia,serif", fontSize:14, color: msg.startsWith('✅') ? '#006600' : '#cc0000', marginBottom:20, fontWeight:700 }}>{msg}</p>}

          <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:16, fontWeight:900, letterSpacing:2, padding:"16px", cursor:"pointer", boxShadow:"4px 4px 0 #1a1a1a" }}>
            {loading ? 'UPLOADING...' : 'SUBMIT TO ECLIPSE COMICS →'}
          </button>
        </div>
      </div>
      <Footer />
    </main>
  )
}