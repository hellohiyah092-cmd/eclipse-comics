'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'

export default function ReadPage({ params }) {
  const [issue, setIssue] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    loadIssue()
    loadComments()
  }, [])

  const loadIssue = async () => {
    const { data } = await supabase
      .from('issues')
      .select('*')
      .eq('id', params.id)
      .single()
    setIssue(data)
    setLoading(false)
  }

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(email)')
      .eq('issue_id', params.id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  const postComment = async () => {
    if (!newComment.trim() || !user) return
    await supabase.from('comments').insert({ user_id: user.id, issue_id: params.id, content: newComment })
    setNewComment('')
    loadComments()
  }

  const REACTIONS = ["❤️","💥","😱","🔥","👊","⚡"]

  const addReaction = async (emoji) => {
    if (!user) return
    await supabase.from('reactions').insert({ user_id: user.id, issue_id: params.id, emoji })
  }

  if (loading) return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ textAlign:"center", padding:"200px 24px", fontFamily:"Georgia,serif", color:"#999" }}>Loading...</div>
    </main>
  )

  if (!issue) return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ textAlign:"center", padding:"200px 24px" }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:36, color:"#cc0000" }}>Issue Not Found</h2>
        <a href="/browse" style={{ fontFamily:"Georgia,serif", color:"#cc0000", fontWeight:700 }}>← Back to Browse</a>
      </div>
    </main>
  )

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"100px 24px 80px" }}>

        {/* Issue header */}
        <div style={{ marginBottom:40, paddingBottom:32, borderBottom:"4px solid #cc0000" }}>
          <a href="/browse" style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:14, color:"#888", textDecoration:"none", display:"block", marginBottom:16 }}>← Back to Browse</a>
          <div style={{ display:"inline-block", background:"#cc0000", color:"#fff", fontFamily:"Georgia,serif", fontWeight:700, fontSize:11, letterSpacing:3, padding:"4px 14px", marginBottom:12 }}>{issue.category?.toUpperCase()}</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"clamp(28px,5vw,52px)", color:"#1a1a1a", letterSpacing:-1, marginBottom:8 }}>{issue.title}</h1>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#cc0000", fontWeight:700, letterSpacing:1 }}>{issue.issue_number}</p>
          <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#555", lineHeight:1.7, marginTop:12, maxWidth:640 }}>{issue.summary}</p>
        </div>

        {/* FILE READER */}
        {issue.file_url && (
          <div style={{ marginBottom:48 }}>
            <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:20, letterSpacing:2, color:"#cc0000", marginBottom:16 }}>READ</h2>
            {issue.file_url.endsWith('.pdf') ? (
              <iframe src={issue.file_url} style={{ width:"100%", height:800, border:"3px solid #1a1a1a", boxShadow:"6px 6px 0 #cc0000" }} title={issue.title} />
            ) : (
              <div style={{ background:"#fff", border:"3px solid #1a1a1a", padding:"32px", boxShadow:"6px 6px 0 #cc0000", textAlign:"center" }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:16, color:"#555", marginBottom:20 }}>This issue is in Word format.</p>
                <a href={issue.file_url} target="_blank" rel="noreferrer"
                  style={{ background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:15, fontWeight:900, letterSpacing:2, padding:"14px 32px", textDecoration:"none", boxShadow:"4px 4px 0 #1a1a1a" }}>
                  📄 DOWNLOAD TO READ →
                </a>
              </div>
            )}
          </div>
        )}

        {/* REACTIONS */}
        <div style={{ marginBottom:48 }}>
          <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:20, letterSpacing:2, color:"#cc0000", marginBottom:16 }}>REACT</h2>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {REACTIONS.map(r => (
              <button key={r} onClick={()=>addReaction(r)}
                style={{ background:"#fff", border:"2px solid #e0d8d0", borderRadius:8, padding:"10px 16px", fontSize:24, cursor: user ? "pointer" : "not-allowed", boxShadow:"3px 3px 0 #eee" }}>
                {r}
              </button>
            ))}
          </div>
          {!user && <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#999", marginTop:8 }}>Sign in to react.</p>}
        </div>

        {/* COMMENTS */}
        <div>
          <h2 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:20, letterSpacing:2, color:"#cc0000", marginBottom:24 }}>COMMENTS</h2>
          {user ? (
            <div style={{ marginBottom:32 }}>
              <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} rows={3} placeholder="Share your thoughts..." style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none", marginBottom:12, resize:"vertical" }} />
              <button onClick={postComment} style={{ background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:14, fontWeight:900, letterSpacing:2, padding:"12px 28px", cursor:"pointer", boxShadow:"4px 4px 0 #1a1a1a" }}>POST COMMENT →</button>
            </div>
          ) : (
            <div style={{ background:"#fff8f0", border:"2px solid #e0c8b0", padding:"20px 24px", marginBottom:32 }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#666" }}>
                <a href="/auth" style={{ color:"#cc0000", fontWeight:700 }}>Sign in</a> to leave a comment.
              </p>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {comments.length === 0 ? (
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#999" }}>No comments yet. Be the first.</p>
            ) : comments.map(c => (
              <div key={c.id} style={{ background:"#fff", border:"2px solid #e0d8d0", borderLeft:"5px solid #cc0000", padding:"16px 20px", boxShadow:"3px 3px 0 #eee" }}>
                <span style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:13, color:"#cc0000" }}>@{c.profiles?.email?.split('@')[0]}</span>
                <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#333", marginTop:6, lineHeight:1.6 }}>{c.content}</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:"#bbb", marginTop:8 }}>{new Date(c.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
