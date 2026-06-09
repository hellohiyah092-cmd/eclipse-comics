
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function NavBar() {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(245,240,232,0.97)' : 'transparent',
      borderBottom: scrolled ? '3px solid #cc0000' : 'none',
      boxShadow: scrolled ? '0 4px 20px rgba(204,0,0,0.15)' : 'none',
      transition: 'all .3s'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 4, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 34, fontWeight: 900, color: '#cc0000', textShadow: '3px 3px 0 #880000' }}>E</span>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 900, color: '#1a1a1a', letterSpacing: 4 }}>CLIPSE</span>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 11, color: '#cc0000', letterSpacing: 5, marginLeft: 4, alignSelf: 'flex-end', paddingBottom: 2 }}>COMICS</span>
        </a>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Browse', href: '/browse' },
            { label: 'Community', href: '/community' },
            { label: 'Lore', href: '/lore' }
				{ label: 'Collaborate', href: '/collaborate'},
          ].map(link => (
            <a key={link.label} href={link.href} style={{ fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#444', textDecoration: 'none', padding: '8px 14px' }}>
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <a href="/submit" style={{ background: '#ffcc00', color: '#1a1a1a', fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', padding: '8px 18px', border: '2px solid #1a1a1a' }}>SUBMIT</a>
              <button onClick={handleSignOut} style={{ background: 'none', border: '2px solid #cc0000', color: '#cc0000', fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, cursor: 'pointer', padding: '8px 14px' }}>SIGN OUT</button>
            </>
          ) : (
            <a href="/auth" style={{ background: '#cc0000', color: '#fff', fontFamily: 'Georgia,serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', padding: '8px 18px', clipPath: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)' }}>LOGIN</a>
          )}
        </div>
      </div>
    </nav>
  )
}


