'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

const CREATOR_TYPES = ['Writer','Artist','Writer & Artist','Colourist','Letterer']
const CONTACT_METHODS = ['Email','Instagram','Twitter/X','WhatsApp','Discord','Other']

export default function CollaboratePage() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [selectedListing, setSelected] = useState(null)

  const [username, setUsername] = useState('')
  const [creatorType, setCreatorType] = useState('Writer')
  const [description, setDescription] = useState('')
  const [genres, setGenres] = useState('')
  const [fee, setFee] = useState('')
  const [contactMethod, setContactMethod] = useState('Email')
  const [contactValue, setContactValue] = useState('')
  const [sample, setSample] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = '/auth'
      else setUser(data.session.user)
    })
    loadListings()
  }, [])

  const loadListings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('collaborations')
      .select('*')
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  const handlePost = async () => {
    if (!username || !description) { setMsg('Please fill in all required fields.'); return }
    setSubmitting(true)
    setMsg('')
    try {
      let sampleUrl = null
      if (sample) {
        const ext = sample.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('collaborations')
          .upload(fileName, sample)
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('collaborations')
            .getPublicUrl(fileName)
          sampleUrl = urlData.publicUrl
        }
      }
      const { error } = await supabase.from('collaborations').insert({
        user_id: user.id,
        username,
        creator_type: creatorType,
        description,
        genres,
        fee,
        contact_method: contactMethod,
        contact_value: contactValue,
        sample_url: sampleUrl,
      })
      if (error) throw error
      setMsg('✅ Your listing is live!')
      setShowForm(false)
      setUsername(''); setDescription(''); setGenres(''); setFee(''); setContactValue(''); setSample(null)
      loadListings()
    } catch (err) {
      setMsg('Something went wrong: ' + err.message)
    }
    setSubmitting(false)
  }

  const filtered = filter === 'All' ? listings : listings.filter(l => l.creator_type === filter)

  const TYPE_COLORS = {
    'Writer': '#cc0000',
    'Artist': '#1a1aff',
    'Writer & Artist': '#8800cc',
    'Colourist': '#cc6600',
    'Letterer': '#006600',
  }

  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />

      {/* HEADER */}
      <div style={{ background:'#1a1a1a', padding:'80px 24px 48px', borderBottom:'4px solid #cc0000' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:5, color:'#cc0000' }}>◆ FIND YOUR CREATIVE PARTNER</span>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(36px,6vw,64px)', color:'#f5f0e8', letterSpacing:-1, textShadow:'4px 4px 0 #cc0000', margin:'8px 0 16px' }}>COLLABORATE</h1>
          <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.7, maxWidth:600, marginBottom:28 }}>Find writers, artists, colourists and letterers to work with. Post your own listing and let the right person find you.</p>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background:'#cc0000', color:'#fff', border:'3px solid #f5f0e8', fontFamily:'Georgia,serif', fontSize:15, fontWeight:900, letterSpacing:2, padding:'14px 32px', cursor:'pointer', boxShadow:'5px 5px 0 #f5f0e8' }}>
            {showForm ? 'CANCEL' : '+ POST YOUR LISTING'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'48px 24px' }}>

        {/* POST FORM */}
        {showForm && (
          <div style={{ background:'#fff', border:'3px solid #1a1a1a', boxShadow:'8px 8px 0 #cc0000', padding:'40px', marginBottom:48 }}>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:28, color:'#1a1a1a', marginBottom:32 }}>YOUR LISTING</h2>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, marginBottom:24 }}>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>YOUR NAME / USERNAME *</label>
                <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="e.g. John Eclipse"
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>CREATOR TYPE *</label>
                <select value={creatorType} onChange={e=>setCreatorType(e.target.value)}
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', background:'#fff' }}>
                  {CREATOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>FEE</label>
                <input value={fee} onChange={e=>setFee(e.target.value)} placeholder="e.g. Free, Negotiable, $50/page"
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>GENRES / STYLES</label>
                <input value={genres} onChange={e=>setGenres(e.target.value)} placeholder="e.g. Action, Horror, Sci-Fi"
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>DESCRIPTION — WHO YOU ARE & WHAT YOU WANT TO CREATE *</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5}
                placeholder="Describe your style, experience, what kind of projects you're looking for and what you bring to a collaboration..."
                style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', resize:'vertical' }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, marginBottom:24 }}>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>CONTACT METHOD</label>
                <select value={contactMethod} onChange={e=>setContactMethod(e.target.value)}
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', background:'#fff' }}>
                  {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>CONTACT DETAILS</label>
                <input value={contactValue} onChange={e=>setContactValue(e.target.value)} placeholder="e.g. yourname@gmail.com or @username"
                  style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
              </div>
            </div>

            <div style={{ marginBottom:32 }}>
              <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>SAMPLE WORK (OPTIONAL)</label>
              <div style={{ border:'2px dashed #cc0000', padding:'24px', textAlign:'center', background:'#fff8f0' }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e=>setSample(e.target.files[0])}
                  style={{ fontFamily:'Georgia,serif', fontSize:14 }} />
                <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#999', marginTop:8 }}>Upload a sample of your work — image or PDF</p>
                {sample && <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#cc0000', fontWeight:700, marginTop:8 }}>✓ {sample.name}</p>}
              </div>
            </div>

            {msg && <p style={{ fontFamily:'Georgia,serif', fontSize:14, color: msg.startsWith('✅') ? '#006600' : '#cc0000', marginBottom:20, fontWeight:700 }}>{msg}</p>}

            <button onClick={handlePost} disabled={submitting}
              style={{ background:'#cc0000', color:'#fff', border:'3px solid #1a1a1a', fontFamily:'Georgia,serif', fontSize:16, fontWeight:900, letterSpacing:2, padding:'16px 40px', cursor:'pointer', boxShadow:'4px 4px 0 #1a1a1a' }}>
              {submitting ? 'POSTING...' : 'POST LISTING →'}
            </button>
          </div>
        )}

        {/* FILTER */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
          {['All',...CREATOR_TYPES].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ background: filter===t ? (TYPE_COLORS[t] || '#1a1a1a') : '#fff', color: filter===t ? '#fff' : '#444', border:`2px solid ${TYPE_COLORS[t] || '#1a1a1a'}`, fontFamily:'Georgia,serif', fontWeight:700, fontSize:12, letterSpacing:2, padding:'8px 18px', cursor:'pointer', transition:'all .2s' }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LISTINGS */}
        {loading ? (
          <p style={{ fontFamily:'Georgia,serif', color:'#999' }}>Loading listings...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <p style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#999', marginBottom:16 }}>No listings yet.</p>
            <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#bbb' }}>Be the first to post a collaboration listing.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:24 }}>
            {filtered.map(listing => (
              <div key={listing.id}
                style={{ background:'#fff', border:'2px solid #e0d8d0', borderTop:`5px solid ${TYPE_COLORS[listing.creator_type] || '#cc0000'}`, padding:'28px 24px', boxShadow:'4px 4px 0 #eee', cursor:'pointer' }}
                onClick={() => setSelected(selected?.id === listing.id ? null : listing)}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ background: TYPE_COLORS[listing.creator_type] || '#cc0000', color:'#fff', fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:2, padding:'4px 12px' }}>{listing.creator_type?.toUpperCase()}</span>
                  {listing.fee && <span style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#888', fontWeight:700 }}>{listing.fee}</span>}
                </div>
                <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:22, color:'#1a1a1a', marginBottom:8 }}>{listing.username}</h3>
                {listing.genres && <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#cc0000', fontWeight:700, letterSpacing:1, marginBottom:10 }}>{listing.genres}</p>}
                <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#555', lineHeight:1.6, marginBottom:16 }}>{listing.description.slice(0,150)}{listing.description.length > 150 ? '...' : ''}</p>

                {selected?.id === listing.id && (
                  <div style={{ borderTop:'2px solid #e0d8d0', paddingTop:16, marginTop:8 }}>
                    <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#333', lineHeight:1.7, marginBottom:16 }}>{listing.description}</p>
                    {listing.sample_url && (
                      <a href={listing.sample_url} target="_blank" rel="noreferrer"
                        style={{ display:'inline-block', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, color:'#cc0000', letterSpacing:1, marginBottom:16 }}>
                        📎 VIEW SAMPLE WORK →
                      </a>
                    )}
                    <div style={{ background:'#fff8f0', border:'2px solid #e0c8b0', padding:'16px 20px' }}>
                      <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:12, letterSpacing:2, color:'#cc0000' }}>CONTACT VIA {listing.contact_method?.toUpperCase()}: </span>
                      <span style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#333' }}>{listing.contact_value}</span>
                    </div>
                  </div>
                )}

                <div style={{ marginTop:12, fontFamily:'Georgia,serif', fontSize:12, color:'#cc0000', fontWeight:700, letterSpacing:1 }}>
                  {selected?.id === listing.id ? 'SHOW LESS ▲' : 'VIEW FULL LISTING ▼'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}


