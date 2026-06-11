'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

const DEADLINE_TYPES = ['weekly','biweekly','monthly','custom_date','custom_interval']
const CATEGORIES = ['heroes','villains','events','sagas','standalone','lore']

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [series, setSeries] = useState([])
  const [issues, setIssues] = useState([])
  const [tab, setTab] = useState('series')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editSeries, setEditSeries] = useState(null)

  // Series form
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('heroes')
  const [description, setDescription] = useState('')
  const [deadlineType, setDeadlineType] = useState('monthly')
  const [intervalDays, setIntervalDays] = useState(30)
  const [nextDeadline, setNextDeadline] = useState('')
  const [autoOrder, setAutoOrder] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = '/auth'
      else {
        setUser(data.session.user)
        loadData(data.session.user.id)
      }
    })
  }, [])

  const loadData = async (userId) => {
    setLoading(true)
    const { data: s } = await supabase
      .from('creator_series')
      .select('*, series_arcs(*)')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
    setSeries(s || [])

    const { data: i } = await supabase
      .from('issues')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
    setIssues(i || [])

    setLoading(false)
  }

  const handleSaveSeries = async () => {
    if (!title) { setMsg('Title is required.'); return }
    setSaving(true)
    setMsg('')
    const payload = {
      creator_id: user.id,
      title, category, description,
      deadline_type: deadlineType,
      deadline_interval_days: deadlineType === 'custom_interval' ? intervalDays : null,
      next_deadline: nextDeadline || null,
      auto_order: autoOrder,
    }
    if (editSeries) {
      await supabase.from('creator_series').update(payload).eq('id', editSeries.id)
      setMsg('✅ Series updated!')
    } else {
      await supabase.from('creator_series').insert(payload)
      setMsg('✅ Series created!')
      // Mark as creator
      await supabase.from('profiles').update({ is_creator: true }).eq('id', user.id)
    }
    setSaving(false)
    setShowForm(false)
    setEditSeries(null)
    resetForm()
    loadData(user.id)
  }

  const resetForm = () => {
    setTitle(''); setCategory('heroes'); setDescription('')
    setDeadlineType('monthly'); setIntervalDays(30); setNextDeadline(''); setAutoOrder(true)
  }

  const startEdit = (s) => {
    setEditSeries(s)
    setTitle(s.title); setCategory(s.category); setDescription(s.description || '')
    setDeadlineType(s.deadline_type || 'monthly')
    setIntervalDays(s.deadline_interval_days || 30)
    setNextDeadline(s.next_deadline || '')
    setAutoOrder(s.auto_order)
    setShowForm(true)
  }

  const deleteSeries = async (id) => {
    if (!confirm('Delete this series? This cannot be undone.')) return
    await supabase.from('creator_series').delete().eq('id', id)
    loadData(user.id)
  }

  const updateIssueOrder = async (issueId, newOrder) => {
    await supabase.from('issues').update({ issue_order: parseInt(newOrder) }).eq('id', issueId)
    loadData(user.id)
  }

  return (
    <main style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <NavBar />

      <div style={{ background:'#1a1a1a', padding:'80px 24px 48px', borderBottom:'4px solid #cc0000' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:5, color:'#cc0000' }}>◆ YOUR CREATIVE HUB</span>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:'clamp(36px,6vw,56px)', color:'#f5f0e8', letterSpacing:-1, textShadow:'4px 4px 0 #cc0000', margin:'8px 0 8px' }}>CREATOR DASHBOARD</h1>
          <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(255,255,255,0.6)' }}>Manage your series, arcs, issues and deadlines.</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'48px 24px' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:'3px solid #1a1a1a', marginBottom:32 }}>
          {[['series','MY SERIES'],['issues','MY ISSUES']].map(([val,label]) => (
            <button key={val} onClick={()=>setTab(val)}
              style={{ background: tab===val ? '#cc0000' : '#fff', color: tab===val ? '#fff' : '#444', border:'2px solid #1a1a1a', borderBottom:'none', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, letterSpacing:2, padding:'12px 24px', cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {msg && <p style={{ fontFamily:'Georgia,serif', fontSize:14, color: msg.startsWith('✅') ? '#006600' : '#cc0000', marginBottom:20, fontWeight:700 }}>{msg}</p>}

        {/* SERIES TAB */}
        {tab === 'series' && (
          <div>
            <button onClick={() => { setShowForm(!showForm); setEditSeries(null); resetForm() }}
              style={{ background:'#cc0000', color:'#fff', border:'3px solid #1a1a1a', fontFamily:'Georgia,serif', fontSize:14, fontWeight:900, letterSpacing:2, padding:'12px 28px', cursor:'pointer', boxShadow:'4px 4px 0 #1a1a1a', marginBottom:32 }}>
              {showForm ? 'CANCEL' : '+ NEW SERIES'}
            </button>

            {/* Series Form */}
            {showForm && (
              <div style={{ background:'#fff', border:'3px solid #1a1a1a', boxShadow:'8px 8px 0 #cc0000', padding:'36px', marginBottom:40 }}>
                <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:22, color:'#1a1a1a', marginBottom:24 }}>{editSeries ? 'EDIT SERIES' : 'NEW SERIES'}</h3>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginBottom:20 }}>
                  <div>
                    <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>SERIES TITLE *</label>
                    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. The Grimwalker"
                      style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>CATEGORY *</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)}
                      style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', background:'#fff' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>SCHEDULE</label>
                    <select value={deadlineType} onChange={e=>setDeadlineType(e.target.value)}
                      style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', background:'#fff' }}>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom_date">Custom Date</option>
                      <option value="custom_interval">Custom Interval (every X days)</option>
                    </select>
                  </div>
                  {deadlineType === 'custom_interval' && (
                    <div>
                      <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>EVERY HOW MANY DAYS?</label>
                      <input type="number" value={intervalDays} onChange={e=>setIntervalDays(e.target.value)} min={1}
                        style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
                    </div>
                  )}
                  <div>
                    <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>NEXT ISSUE DATE</label>
                    <input type="date" value={nextDeadline} onChange={e=>setNextDeadline(e.target.value)}
                      style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', display:'block', marginBottom:6 }}>DESCRIPTION</label>
                  <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
                    placeholder="What is this series about?"
                    style={{ width:'100%', padding:'12px 16px', fontFamily:'Georgia,serif', fontSize:15, border:'2px solid #ddd', borderTop:'3px solid #cc0000', outline:'none', resize:'vertical' }} />
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                  <input type="checkbox" id="autoOrder" checked={autoOrder} onChange={e=>setAutoOrder(e.target.checked)}
                    style={{ width:18, height:18, cursor:'pointer' }} />
                  <label htmlFor="autoOrder" style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#333', cursor:'pointer' }}>
                    Auto chronological order — issues posted first are read first
                  </label>
                </div>

                <button onClick={handleSaveSeries} disabled={saving}
                  style={{ background:'#cc0000', color:'#fff', border:'3px solid #1a1a1a', fontFamily:'Georgia,serif', fontSize:15, fontWeight:900, letterSpacing:2, padding:'14px 36px', cursor:'pointer', boxShadow:'4px 4px 0 #1a1a1a' }}>
                  {saving ? 'SAVING...' : editSeries ? 'UPDATE SERIES' : 'CREATE SERIES'}
                </button>
              </div>
            )}

            {/* Series list */}
            {loading ? (
              <p style={{ fontFamily:'Georgia,serif', color:'#999' }}>Loading...</p>
            ) : series.length === 0 ? (
              <p style={{ fontFamily:'Georgia,serif', color:'#999', fontSize:16 }}>No series yet. Create your first one above.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {series.map(s => (
                  <div key={s.id} style={{ background:'#fff', border:'2px solid #e0d8d0', borderLeft:'5px solid #cc0000', padding:'24px 28px', boxShadow:'4px 4px 0 #eee' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#cc0000', marginBottom:6 }}>{s.category?.toUpperCase()} · {s.deadline_type?.toUpperCase().replace('_',' ')}</div>
                        <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:22, color:'#1a1a1a', marginBottom:8 }}>{s.title}</h3>
                        {s.description && <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'#666', lineHeight:1.6, marginBottom:8 }}>{s.description}</p>}
                        {s.next_deadline && <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#cc6600', fontWeight:700 }}>Next issue due: {new Date(s.next_deadline).toLocaleDateString()}</p>}
                        <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#999', marginTop:4 }}>
                          {s.auto_order ? '✓ Auto chronological order' : '✎ Manual reading order'}
                        </p>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={()=>startEdit(s)}
                          style={{ background:'none', border:'2px solid #cc0000', color:'#cc0000', fontFamily:'Georgia,serif', fontWeight:700, fontSize:12, letterSpacing:1, padding:'8px 16px', cursor:'pointer' }}>
                          EDIT
                        </button>
                        <button onClick={()=>deleteSeries(s.id)}
                          style={{ background:'none', border:'2px solid #999', color:'#999', fontFamily:'Georgia,serif', fontWeight:700, fontSize:12, letterSpacing:1, padding:'8px 16px', cursor:'pointer' }}>
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ISSUES TAB */}
        {tab === 'issues' && (
          <div>
            {loading ? (
              <p style={{ fontFamily:'Georgia,serif', color:'#999' }}>Loading...</p>
            ) : issues.length === 0 ? (
              <p style={{ fontFamily:'Georgia,serif', color:'#999', fontSize:16 }}>No issues yet. Submit your work to get started.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {issues.map(issue => (
                  <div key={issue.id} style={{ background:'#fff', border:'2px solid #e0d8d0', borderLeft:'5px solid #cc0000', padding:'20px 24px', boxShadow:'3px 3px 0 #eee' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                      <div style={{ flex:1 }}>
                        <h3 style={{ fontFamily:'Georgia,serif', fontWeight:900, fontSize:18, color:'#1a1a1a', marginBottom:4 }}>{issue.title}</h3>
                        <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#888' }}>
                          {issue.issue_number}
                          {issue.page_count ? ` · ${issue.page_count} pages` : ''}
                          {issue.published ? ' · ✅ Published' : ' · ⏳ Pending'}
                        </p>
                      </div>
                      {!issue.auto_order && (
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <label style={{ fontFamily:'Georgia,serif', fontSize:12, color:'#cc0000', fontWeight:700 }}>ORDER:</label>
                          <input type="number" defaultValue={issue.issue_order || 1} min={1}
                            onBlur={e=>updateIssueOrder(issue.id, e.target.value)}
                            style={{ width:60, padding:'6px 10px', fontFamily:'Georgia,serif', fontSize:14, border:'2px solid #ddd', outline:'none', textAlign:'center' }} />
                        </div>
                      )}
                      <a href={`/read/${issue.id}`}
                        style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, color:'#cc0000', letterSpacing:1, textDecoration:'none' }}>
                        READ →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}














