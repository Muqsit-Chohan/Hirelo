import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'motion/react'
import { Workspace, WorkspaceStats, WorkspaceToolbar, WorkspaceEmpty, WorkspaceLoading } from '../components/common/Workspace'
import toast, { Toaster } from 'react-hot-toast'
// import supaBase from '../services/supabaseClient'
import { useAuth } from '../components/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from "../services/api/api"
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Building, 
  Calendar,
  FileText,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Target,
  Users
} from 'lucide-react';

const MyJobs = () => {
  const { user } = useAuth();
  // console.log(user,"myjobuser..........");
  
  const [companyJobs, setCompanyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const [updating, setUpdating] = useState([])
  // console.log(selectedJob,"selectedJob...........");
  
  const navigate = useNavigate();

  useEffect(() => {
  if (!user) return;

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/v1/jobs/company/applicants`);
      const data = res?.data?.data;

      setCompanyJobs(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false); // 👈 ALWAYS runs
    }
  };

  fetchCompanyJobs();
}, [user]);

  const toggleVisibility = async (jobId, value) => {
    setUpdating(prev => [...prev, jobId]);
    try {
      await API.patch(`/v1/jobs/${jobId}/visibility`,{visibility:value})
      setCompanyJobs(prev =>
        prev.map(job =>
          job.job._id === jobId ? { ...job, job: { ...job.job, visibility: value } } : job
        )
      );
    } catch {
    toast.error('Unable to update visibility. Please try again.');
      
    } finally { setUpdating(prev => prev.filter(id => id !== jobId)); }
  };

  const parseArrayData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const visibleJobs = companyJobs.filter(({ job }) => (!query.trim() || [job?.jobTitle, job?.location].some(value => value?.toLowerCase().includes(query.trim().toLowerCase()))))
  return (
    <Workspace title="Space for your next great hire" description="Your roles, thoughtfully organized. Manage your listings and connect with the people who will move your team forward." eyebrow="HIRING WORKSPACE" action={{ label: 'Post a new job', onClick: () => navigate('/post-job') }}>
      <Toaster position="top-center" />
      <WorkspaceStats loading={loading || error} items={[{ label: 'Total job listings', value: companyJobs.length }, { label: 'Visible listings', value: companyJobs.filter(item => item.job?.visibility).length }, { label: 'Total applications', value: companyJobs.reduce((total, item) => total + (Number(item.applicants) || 0), 0) }]} />
      <section className="workspace-panel" aria-label="Your job listings">
        <WorkspaceToolbar title="Job listings" count={visibleJobs.length} query={query} onQuery={setQuery} />
      {loading ? <WorkspaceLoading /> : error ? <WorkspaceEmpty title="We couldn?t load your listings" description="Refresh the page to try again." action={{ label: 'Try again', onClick: () => window.location.reload() }} /> : companyJobs.length > 0 ? (
        <div>
          {visibleJobs.length ? <div className="workspace-table-wrap"><table className="workspace-table">
            <thead><tr>{['Role', 'Date posted', 'Location', 'Applications', 'Visible'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
            <tbody>{visibleJobs.map(({ job, applicants }, index) => <tr key={job._id} style={{ '--rise-index': index }}>
              <td><div className="workspace-person"><span className="workspace-avatar"><Briefcase size={18} /></span><div><button className="workspace-link" onClick={() => setSelectedJob(job)}>{job.jobTitle}</button><span className="workspace-muted">{job.jobType || 'Job listing'}</span></div></div></td>
              <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not available'}</td>
              <td>{job.location || 'Not specified'}</td><td>{applicants ?? 0}</td>
              <td><input type="checkbox" className="workspace-switch" aria-label={'Show ' + job.jobTitle + ' in job listings'} checked={job.visibility === true} disabled={updating.includes(job._id)} onChange={e => toggleVisibility(job._id, e.target.checked)} /></td>
            </tr>)}</tbody>
          </table></div> : <WorkspaceEmpty title="No matching roles" description="Try a different role or location." action={{ label: 'Clear search', onClick: () => setQuery('') }} />}
          {/* Modal */}
          <AnimatePresence>
          {selectedJob && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-24 px-4">
              <Motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-white w-full md:w-11/12 lg:w-4/5 rounded-2xl shadow-xl relative p-8">
                {/* Close Button */}
                <button
                  aria-label="Close job details" onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 text-gray-600 text-xl font-bold hover:text-red-600 cursor-pointer"
                >
                  ×
                </button>

                {/* Job Header */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900">{selectedJob.jobTitle}</h2>
                  <p className="text-lg text-gray-700 mt-2"><Building className="inline mr-1" size={18} /> {selectedJob.companyName || "Private Organization"}</p>
                  <p className="text-lg text-gray-700"><MapPin className="inline mr-1" size={18} /> {selectedJob.location || "Remote"}</p>
                  <p className="text-lg text-gray-700"><Calendar className="inline mr-1" size={18} /> {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                        <FileText size={24} className="text-green-600" /> Job Description
                      </h3>
                      <p>{selectedJob?.description || "No description provided."}</p>
                    </section>

                    {/* Responsibilities */}
                    {selectedJob?.responsibilities?.length > 0 && (
                      <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                          <Target size={24} className="text-blue-600" /> Responsibilities
                        </h3>
                        <ul className="list-disc ml-6 space-y-2">
                          {parseArrayData(selectedJob?.responsibilities).map((res, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle size={18} className="text-green-500 mt-1" /> {res}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Requirements */}
                    {selectedJob?.requirements?.length > 0 && (
                      <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                          <User size={24} className="text-purple-600" /> Requirements
                        </h3>
                        <ul className="list-disc ml-6 space-y-2">
                          {parseArrayData(selectedJob?.requirements).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle size={18} className="text-green-500 mt-1" /> {req}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {/* Right */}
                  <div className="space-y-6">
                    {/* Job Overview */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h3 className="text-lg font-bold mb-2">Job Overview</h3>
                      <p><Briefcase className="inline mr-2" /> <strong>Type:</strong> {selectedJob?.jobType || "Full-Time"}</p>
                      <p><User className="inline mr-2" /> <strong>Experience:</strong> {selectedJob?.ExperienceLevel || "Not specified"}</p>
                      <p><GraduationCap className="inline mr-2" /> <strong>Education:</strong> {selectedJob?.EducationRequirement || "Not specified"}</p>
                      <p><Clock className="inline mr-2" /> <strong>Schedule:</strong> {selectedJob?.workSchedule || "Not specified"}</p>
                      {selectedJob?.numberOpening && <p><Users className="inline mr-2" /> <strong>Openings:</strong> {selectedJob?.numberOpening}</p>}
                      {selectedJob?.deadline && <p><Calendar className="inline mr-2" /> <strong>Deadline:</strong>{selectedJob?.deadline}</p>}
                    </div>

                    {/* Skills */}
                    {selectedJob?.skills?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perks */}
                    {selectedJob?.perks?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-2">Perks & Benefits</h3>
                        <ul className="list-disc ml-6 space-y-1">
                          {selectedJob.perks.map((perk, idx) => (
                            <li key={idx}>{perk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Motion.div>
            </Motion.div>
          )}
          </AnimatePresence>
        </div>
      ) : (
        <WorkspaceEmpty title="Great teams start with one role" description="Create your first listing and open the door to your next great hire." action={{ label: 'Create a job listing', onClick: () => navigate('/post-job') }} />
      )}
      </section>
    </Workspace>
  )
}
export default MyJobs
