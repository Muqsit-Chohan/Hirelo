import { ArrowUpRight, BriefcaseBusiness, Check, Clock3, Search, Users, X } from 'lucide-react'
import Navbar from './navbar/Navbar'
import '../../assets/styles/workspace.css'

export function Workspace({ title, description, eyebrow = 'YOUR WORKSPACE', action, children }) {
  return <div className="workspace"><Navbar /><main className="workspace-main">
    <header className="workspace-hero"><div className="workspace-intro"><span className="workspace-eyebrow"><span />{eyebrow}</span><h1>{title}<span>.</span></h1><p>{description}</p>{action && <button className="workspace-button" onClick={action.onClick}>{action.label}<ArrowUpRight size={17} /></button>}</div><div className="workspace-art career-visual" aria-hidden="true">
      <div className="career-visual-top"><span>THE NEXT CHAPTER</span><ArrowUpRight size={19} /></div>
      <div className="career-path">
        <span className="career-node career-node-search"><Search size={23} strokeWidth={1.7} /></span>
        <span className="career-node career-node-people"><Users size={25} strokeWidth={1.7} /></span>
        <span className="career-node career-node-goal"><BriefcaseBusiness size={28} strokeWidth={1.7} /><span><Check size={12} strokeWidth={3} /></span></span>
      </div>
      <div className="career-visual-bottom"><strong>Great things<br />start with a connection.</strong><span>Discover. Connect. Grow.</span></div>
    </div></header>
    {children}
    <footer className="workspace-footer">A little more organized. A step closer to what’s next.</footer>
  </main></div>
}

export function WorkspaceStats({ items, loading }) {
  const icons = [BriefcaseBusiness, Clock3, Check, Users]
  return <div className="workspace-stats">{items.map((item, index) => { const Icon = icons[index % icons.length]; return <div className="workspace-stat" style={{ '--rise-index': index }} key={item.label}><span className="workspace-stat-icon"><Icon size={20} /></span><div><p>{item.label}</p><strong>{loading ? '—' : item.value}</strong></div></div> })}</div>
}

export function WorkspaceToolbar({ title, count, query, onQuery, filter, onFilter, options = ['all', 'pending', 'accepted', 'rejected'] }) {
  return <div className="workspace-toolbar"><div><h2>{title} <span>{count}</span></h2><p>Everything you need, in one place.</p></div><div className="workspace-controls"><label className="workspace-search"><Search size={17} /><input aria-label={`Search ${title.toLowerCase()}`} placeholder="Search by name or role…" value={query} onChange={e => onQuery(e.target.value)} />{query && <button aria-label="Clear search" onClick={() => onQuery('')}><X size={15} /></button>}</label>{onFilter && <select aria-label="Filter by status" value={filter} onChange={e => onFilter(e.target.value)}>{options.map(value => <option key={value} value={value}>{value === 'all' ? 'All statuses' : value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select>}</div></div>
}

export function StatusBadge({ status = 'pending' }) {
  const value = status || 'pending'
  return <span className={`workspace-badge workspace-badge-${value}`}><span />{value}</span>
}

export function WorkspaceEmpty({ title, description, action }) {
  return <div className="workspace-empty"><span className="workspace-empty-icon"><BriefcaseBusiness size={28} strokeWidth={1.4} /></span><h3>{title}</h3><p>{description}</p>{action && <button className="workspace-button" onClick={action.onClick}>{action.label}<ArrowUpRight size={16} /></button>}</div>
}

export function WorkspaceLoading() {
  return <div className="workspace-loading" role="status"><span />Loading your workspace…</div>
}
