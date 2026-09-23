import hireloIcon from '../../../assets/images/hirelo-icon.svg'
﻿import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useAuth } from '../../Auth/AuthContext'

export default function Navbar() {
  const { user, signOutUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const profileRef = useRef(null)
  const company = user?.role === 'company'
  const items = company ? [{ name: 'My jobs', path: '/myjobs' }, { name: 'Applications', path: '/viewapplications' }] : [
    { name: 'Home', path: '/' }, { name: 'Find jobs', path: '/jobs' }, { name: 'About', path: '/about' }, { name: 'Contact', path: '/contactus' }, { name: 'Journal', path: '/blogs' },
    ...(user?.role === 'job Seeker' ? [{ name: 'Applied jobs', path: '/applied' }] : []),
  ]
  useEffect(() => {
    const dismiss = event => {
      if (event.type === 'keydown' && event.key === 'Escape') { setOpen(false); setProfileOpen(false) }
      if (event.type === 'pointerdown' && !profileRef.current?.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss) }
  }, [])
  const closeMenus = () => { setOpen(false); setProfileOpen(false) }
  const logout = async () => {
    setLoggingOut(true)
    try { await signOutUser(); closeMenus(); navigate('/login') }
    catch (error) { console.error('Logout failed:', error.message) }
    finally { setLoggingOut(false) }
  }
  return <nav className="site-nav" aria-label="Main navigation">
    <div className="site-nav-inner">
      <Link to="/" className="site-brand" onClick={closeMenus} aria-label="Hirelo home"><img src={hireloIcon} className="hirelo-nav-icon" alt="" /><span className="hirelo-wordmark">Hirelo</span></Link>
      <div className="site-nav-links">{items.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={closeMenus} className={({ isActive }) => `site-nav-link ${isActive || (item.path === '/blogs' && location.pathname.startsWith('/blog/')) ? 'is-active' : ''}`}>{item.name}</NavLink>)}</div>
      <div className="site-nav-actions">{company && <Link to="/post-job" className="site-nav-cta" onClick={closeMenus}>Post a job<ArrowUpRight size={16} /></Link>}
        {user ? <div className="site-profile" ref={profileRef}><button className="site-profile-trigger" aria-label="Account options" aria-expanded={profileOpen} aria-controls="account-options" onClick={() => { setProfileOpen(!profileOpen); setOpen(false) }}><span className="site-avatar">{user.profile?.profilePhoto?.startsWith('http') ? <img src={user.profile.profilePhoto} alt="" /> : (user.fullName || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}</span><ChevronDown size={14} /></button>{profileOpen && <div className="site-profile-menu" id="account-options"><p>{user.fullName || user.email}</p><span>{company ? 'Company account' : 'Your career workspace'}</span><Link to="/profile" onClick={closeMenus}><UserRound size={16} />View profile</Link><button onClick={logout} disabled={loggingOut}><LogOut size={16} />{loggingOut ? 'Signing out…' : 'Sign out'}</button></div>}</div> : <Link className="site-nav-cta" to="/login" onClick={closeMenus}>Sign in<ArrowUpRight size={16} /></Link>}
        <button className="site-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { setOpen(!open); setProfileOpen(false) }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {open && <div className="site-mobile-nav" id="mobile-navigation">{items.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={closeMenus}>{item.name}</NavLink>)}{company && <Link to="/post-job" onClick={closeMenus}>Post a job</Link>}</div>}
  </nav>
}
