


'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import NavBar from '../../../components/NavBar'
import Footer from '../../../components/Footer'

export default function ProfilePage({ params }) {
  const [profile, setProfile] = useState(null)
  const [series, setSeries] = useState([])
  const [issues, setIssues] = useState([])
  const [user, setUser] = useState(null)
  const [vote, setVote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single()
    setProfile(p)
    setUsername(p?.username || '')
    setBio(p?.bio || '')

    const { data: s } = await supabase
      .from('creator_series')
      .select('*')
      .eq('creator_id', params.id)
      .order('created_at', { ascending: true })
    setSeries(s || [])

    const { data: i } = await supabase
      .from('issues')
      .select('*')
      .eq('creator_id', params.id)
      .eq('published', true)
      .order('created_at', { ascending: false })
    setIssues(i || [])

    setLoading(false)
  }

  const handleVote = async (voteType) => {
    if (!user) { window.location.href = '/auth'; return }
    if (vote === voteType) {
      await supabase.from('creator_votes').delete()
        .eq('voter_id', user.id).eq('creator_id', params.id)
      setVote(null)
    } else {
      await supabase.from('creator_votes').upsert({
        voter_id: user.id, creator_id: params.id, vote: voteType
      })
      setVote(voteType)
    }
    loadProfile()
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ username, bio }).eq('id', user.id)
    setSaving(false)
    setEditing(false)
    loadProfile()
  }

  const isOwner = user?.id === params.id

  const CATEGORY_COLORS = {
    heroes:'#cc0000', villains:'#1a1aff', events:'#8800cc',
    sagas:'#006600', standalone:'#cc6600', lore:'#005577'
  }

  if (loading) return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />
      <div style={{ textAlign:'center', padding:'200px 24px', fontFamily:'Georgia,serif', color:'#999' }}>Loading...</div>
    </main>
  )

  if (!profile) return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />
      <div style={{ textAlign:'center', padding:'200px 24px' }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:36, color:'#cc0000' }}>Profile Not Found</h2>
      </div>
    </main>
  )

  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />

      {/* PROFILE HEADER */}
      <div style={{ background:'#1a1a1a', padding:'80px 24px 48px', borderBottom:'4px solid #cc0000' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'flex-start', gap:32, flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle,#ff4444,#990000)', border:'4px solid #cc0000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:40, color:'#ffcc00' }}>
              {(profile.username || profile.email || '?')[0].toUpperCase()}
            </span>
          </div>

          <div style={{ flex:1 }}>
            {editing ? (
              <div>
                <input value={username} onChange={e=>setUsername(e.target.value)}
                  placeholder="Your username"
                  style={{ display:'block', fontFamily:'Georgia,serif', fontSize:24, fontWeight:900, color:'#1a1a1a', padding:'8px 12px', border:'2px solid #cc0000', marginBottom:12, width:'100%', maxWidth:400 }} />
                <textarea value={bio} onChange={e=>setBio(e.target.value)}
                  placeholder="Tell people about yourself and your work..."
                  rows={3}
                  style={{ display:'block', fontFamily:'Georgia,serif', fontSize:15, color:'#1a1a1a', padding:'8px 12px', border:'2px solid #cc0000', marginBottom:16, width:'100%', maxWidth:600, resize:'vertical' }} />
                <div style={{ display:'flex', gap:12 }}>
                  <button onClick={handleSave} disabled={saving}
                    style={{ background:'#cc0000', color:'#fff', border:'2px solid #f5f0e8', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, letterSpacing:2, padding:'10px 24px', cursor:'pointer' }}>
                    {saving ? 'SAVING...' : 'SAVE'}
                  </button>
                  <button onClick={()=>setEditing(false)}
                    style={{ background:'none', color:'#f5f0e8', border:'2px solid #666', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, letterSpacing:2, padding:'10px 24px', cursor:'pointer' }}>
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(28px,5vw,48px)', color:'#f5f0e8', letterSpacing:-1, marginBottom:8 }}>
                  {profile.username || 'Unnamed Creator'}
                </h1>
                {profile.bio && <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.7, maxWidth:600, marginBottom:16 }}>{profile.bio}</p>}
                <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                  {/* Likes/Dislikes */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>handleVote('like')}
                      style={{ background: vote==='like' ? '#006600' : '#333', color:'#fff', border:'2px solid #555', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, padding:'8px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                      👍 {profile.likes || 0}
                    </button>
                    <button onClick={()=>handleVote('dislike')}
                      style={{ background: vote==='dislike' ? '#cc0000' : '#333', color:'#fff', border:'2px solid #555', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, padding:'8px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                      👎 {profile.dislikes || 0}
					   <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {series.map(s => (
                <div key={s.id} style={{ background:'#fff', border:'2px solid #e0d8d0', borderTop:`5px solid ${CATEGORY_COLORS[s.category]||'#cc0000'}`, padding:'24px', boxShadow:'4px 4px 0 #eee' }}>
                  <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:CATEGORY_COLORS[s.category]||'#cc0000', marginBottom:8 }}>{s.category?.toUpperCase()}</div>
                  <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:20, color:'#1a1a1a', marginBottom:8 }}>{s.title}</h3>
                  {s.description && <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#666', lineHeight:1.6, marginBottom:12 }}>{s.description}</p>}
                  {s.next_deadline && (
                    <div style={{ background:'#fff8f0', border:'1px solid #e0c8b0', padding:'8px 12px', marginBottom:12 }}>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:11, fontWeight:700, letterSpacing:2, color:'#cc6600' }}>NEXT ISSUE: {new Date(s.next_deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {s.deadline_type && <span style={{ fontFamily:'Georgia,serif', fontSize:11, color:'#999', letterSpacing:1 }}>{s.deadline_type?.toUpperCase().replace('_',' ')} SCHEDULE</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ISSUES */}
        {issues.length > 0 && (
          <div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:28, color:'#1a1a1a', letterSpacing:-1, marginBottom:24 }}>PUBLISHED ISSUES</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {issues.map(issue => (
                <a key={issue.id} href={`/read/${issue.id}`}
                  style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', background:'#fff', border:'2px solid #e0d8d0', borderLeft:`5px solid ${CATEGORY_COLORS[issue.category]||'#cc0000'}`, textDecoration:'none', boxShadow:'3px 3px 0 #eee' }}>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:17, color:'#1a1a1a', marginBottom:4 }}>{issue.title}</h3>
                    <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#888' }}>
                      {issue.issue_number}
                      {issue.page_count ? ` · ${issue.page_count} pages` : ''}
                    </p>
                  </div>
                  <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, color:CATEGORY_COLORS[issue.category]||'#cc0000', letterSpacing:1 }}>READ →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {issues.length === 0 && series.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#999' }}>No published content yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

















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



