import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../components/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../services/api/api'
import { Workspace, WorkspaceStats, WorkspaceToolbar, WorkspaceEmpty, WorkspaceLoading, StatusBadge } from '../components/common/Workspace'

export default function JobAppliedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(false)
    try { const res = await API.get('/v1/jobs/applied'); setApplications(res.data.applications || []) }
    catch { setError(true) } finally { setLoading(false) }
  }, [])
  useEffect(() => { if (user) fetchApplications() }, [user, fetchApplications])
  const visible = applications.filter(app => (filter === 'all' || (app.status || 'pending') === filter) && (!query.trim() || [app.job?.jobTitle, app.job?.postedBy?.companyName, app.job?.location].some(value => value?.toLowerCase().includes(query.trim().toLowerCase()))))
  return <Workspace title="Your next chapter" description="Every application is a new possibility. Keep track of your progress and make room for what’s next." eyebrow="YOUR CAREER WORKSPACE" action={{ label: 'Explore opportunities', onClick: () => navigate('/jobs') }}>
    <WorkspaceStats loading={loading || error} items={[{ label: 'Applications sent', value: applications.length }, { label: 'Awaiting a response', value: applications.filter(a => !a.status || a.status === 'pending').length }, { label: 'Accepted applications', value: applications.filter(a => a.status === 'accepted').length }]} />
    <section className="workspace-panel" aria-label="Applied jobs"><WorkspaceToolbar title="Applied jobs" count={visible.length} query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />
      {loading ? <WorkspaceLoading /> : error ? <WorkspaceEmpty title="We couldn’t load your applications" description="Please try again to see your latest progress." action={{ label: 'Try again', onClick: fetchApplications }} /> : visible.length ? <div className="workspace-table-wrap"><table className="workspace-table"><thead><tr>{['Company', 'Role', 'Location', 'Applied on', 'Status'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{visible.map(app => <tr key={app._id}><td><div className="workspace-person"><span className="workspace-avatar" aria-hidden="true">{(app.job?.postedBy?.companyName || 'P').slice(0, 2).toUpperCase()}</span><span className="workspace-link">{app.job?.postedBy?.companyName || 'Private organization'}</span></div></td><td><span className="workspace-link">{app.job?.jobTitle || 'Unavailable role'}</span></td><td>{app.job?.location || 'Not specified'}</td><td>{app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not available'}</td><td><StatusBadge status={app.status} /></td></tr>)}</tbody></table></div> : <WorkspaceEmpty title={applications.length ? 'No matching applications' : 'Make your first move'} description={applications.length ? 'Try another search or status filter.' : 'Discover a role that feels right. Your applications and updates will find a home here.'} action={{ label: applications.length ? 'Clear filters' : 'Browse jobs', onClick: applications.length ? () => { setQuery(''); setFilter('all') } : () => navigate('/jobs') }} />}
    </section>
  </Workspace>
}
