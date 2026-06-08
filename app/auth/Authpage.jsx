'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    setMsg('')
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg(error.message)
      else window.location.href = '/'
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg(error.message)
      else setMsg('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <main style={{ background:"#f5f0e8", minHeight:"100vh" }}>
      <NavBar />
      <div style={{ maxWidth:480, margin:"0 auto", padding:"140px 24px 80px" }}>
        <div style={{ background:"#fff", border:"3px solid #1a1a1a", boxShadow:"8px 8px 0 #cc0000", padding:"48px 40px" }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:36, color:"#1a1a1a", marginBottom:8 }}>{mode==='login' ? 'SIGN IN' : 'REGISTER'}</h1>
          <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#666", marginBottom:32 }}>{mode==='login' ? 'Welcome back to Eclipse Comics.' : 'Join the Eclipse universe.'}</p>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>EMAIL</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none" }} />
          </div>
          <div style={{ marginBottom:32 }}>
            <label style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:12, letterSpacing:2, color:"#cc0000", display:"block", marginBottom:6 }}>PASSWORD</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" style={{ width:"100%", padding:"12px 16px", fontFamily:"Georgia,serif", fontSize:15, border:"2px solid #ddd", borderTop:"3px solid #cc0000", outline:"none" }} />
          </div>
          {msg && <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#cc0000", marginBottom:20 }}>{msg}</p>}
          <button onClick={handle} disabled={loading} style={{ width:"100%", background:"#cc0000", color:"#fff", border:"3px solid #1a1a1a", fontFamily:"Georgia,serif", fontSize:16, fontWeight:900, letterSpacing:2, padding:"14px", cursor:"pointer", boxShadow:"4px 4px 0 #1a1a1a" }}>
            {loading ? 'PLEASE WAIT...' : mode==='login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
          <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#666", marginTop:24, textAlign:"center" }}>
            {mode==='login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={()=>setMode(mode==='login'?'register':'login')} style={{ background:"none", border:"none", color:"#cc0000", fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {mode==='login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
