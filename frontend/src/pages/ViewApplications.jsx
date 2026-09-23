import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../components/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import DropdownMenuDialog from '../components/DropDowMenu/DropdownMenuDialog'
import { FileDown } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import API from '../services/api/api'
import { Workspace, WorkspaceStats, WorkspaceToolbar, WorkspaceEmpty, WorkspaceLoading, StatusBadge } from '../components/common/Workspace'

export default function ViewApplications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState([])
  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await API.get('/v1/jobs/company/allapplications')
      setApplications(res?.data?.applications || [])
    } catch { setError(true) } finally { setLoading(false) }
  }, [])
  useEffect(() => { if (user) fetchApplications() }, [user, fetchApplications])
  const updateStatus = async (id, status) => {
    setUpdating(prev => [...prev, id])
    try {
      await API.patch(`/v1/jobs/application/${id}/status`, { status })
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app))
      toast.success('Application status updated')
    } catch { toast.error('Unable to update status. Please try again.') }
    finally { setUpdating(prev => prev.filter(value => value !== id)) }
  }
  const visible = applications.filter(app => (filter === 'all' || (app.status || 'pending') === filter) && (!query.trim() || [app.applicant?.fullName, app.job?.jobTitle, app.job?.location].some(value => value?.toLowerCase().includes(query.trim().toLowerCase()))))
  return <Workspace title="Good people. Great possibilities" description="A clear view of your next great hire. Review candidates, explore their experience, and keep things moving." eyebrow="HIRING WORKSPACE" action={{ label: 'Manage job listings', onClick: () => navigate('/myjobs') }}>
    <Toaster position="top-center" />
    <WorkspaceStats loading={loading || error} items={[{ label: 'Total applications', value: applications.length }, { label: 'Awaiting review', value: applications.filter(a => !a.status || a.status === 'pending').length }, { label: 'Accepted candidates', value: applications.filter(a => a.status === 'accepted').length }]} />
    <section className="workspace-panel" aria-label="Job applications">
      <WorkspaceToolbar title="Applications" count={visible.length} query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />
      {loading ? <WorkspaceLoading /> : error ? <WorkspaceEmpty title="We couldn’t load your applications" description="Please try again to see your latest candidates." action={{ label: 'Try again', onClick: fetchApplications }} /> : visible.length ? <div className="workspace-table-wrap"><table className="workspace-table"><thead><tr>{['Candidate', 'Applied for', 'Location', 'Resume', 'Status', 'Action'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>
        {visible.map((app, index) => <tr key={app._id} style={{ '--rise-index': index }}><td><div className="workspace-person"><span className="workspace-avatar" aria-hidden="true">{(app.applicant?.fullName || '?').split(' ').map(n => n[0]).slice(0, 2).join('')}</span><div>{app.applicant?._id ? <button className="workspace-link" onClick={() => navigate(`/seeker/${app.applicant._id}`)}>{app.applicant.fullName || 'View candidate'}</button> : app.applicant?.fullName || 'Unknown applicant'}<span className="workspace-muted">Candidate</span></div></div></td><td><span className="workspace-link">{app.job?.jobTitle || 'Unavailable role'}</span></td><td>{app.job?.location || 'Not specified'}</td><td>{app.resume?.url ? <a className="workspace-resume" href={app.resume.url} target="_blank" rel="noopener noreferrer"><FileDown size={14} />Resume</a> : 'Not provided'}</td><td><StatusBadge status={app.status} /></td><td><DropdownMenuDialog appId={app._id} updateStatus={updateStatus} disabled={updating.includes(app._id)} /></td></tr>)}
      </tbody></table></div> : <WorkspaceEmpty title={applications.length ? 'No matching applications' : 'Your next great hire starts here'} description={applications.length ? 'Try a different search or status to find the right candidate.' : 'Applications will appear here as candidates discover your jobs.'} action={{ label: applications.length ? 'Clear filters' : 'Refresh applications', onClick: applications.length ? () => { setQuery(''); setFilter('all') } : fetchApplications }} />}
    </section>
  </Workspace>
}
