import hireloIcon from '../../../assets/images/hirelo-icon.svg'
import { ArrowUpRight, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../assets/styles/job-search.css'

export default function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('')
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const submitSearch = (event) => {
    event.preventDefault()
    const values = { keyword: keyword.trim(), location: location.trim() }
    if (onSearch) onSearch(values)
    else navigate(`/jobs?${new URLSearchParams(values)}`)
  }

  return <section className="job-search-hero" aria-label="Find your next role">
    <div className="job-search-inner">
      <div className="job-search-heading">
        <div><span className="job-search-eyebrow"><span /> YOUR NEXT CHAPTER</span>
          <h1>Good work starts with<br /><span>the right opportunity.</span></h1>
          <p>Find a role that fits your skills, your ambitions, and your life.</p>
        </div>
        <div className="job-search-aside" aria-hidden="true"><img className="job-search-brand-icon" src={hireloIcon} alt="" /><div><strong className="job-search-brand-name">Hirelo</strong><p>Your next move.<br />A better fit.</p></div></div>
      </div>
      <form className="job-search-form" onSubmit={submitSearch} role="search">
        <label className="job-search-field"><Search size={21} strokeWidth={1.6} /><span><span className="job-search-label">WHAT DO YOU WANT TO DO?</span><input type="search" placeholder="Job title or keyword" value={keyword} onChange={event => setKeyword(event.target.value)} /></span></label>
        <label className="job-search-field job-search-location"><MapPin size={21} strokeWidth={1.6} /><span><span className="job-search-label">WHERE WOULD YOU LIKE TO WORK?</span><input type="text" placeholder="City, state, or country" value={location} onChange={event => setLocation(event.target.value)} /></span></label>
        <button type="submit">Find opportunities<ArrowUpRight size={18} /></button>
      </form>
      <div className="job-search-caption"><span>One search. Your next possibility.</span><span>Leave fields empty to explore all roles<ArrowUpRight size={13} /></span></div>
    </div>
  </section>
}
