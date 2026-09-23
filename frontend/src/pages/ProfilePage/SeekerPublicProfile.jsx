import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import API from '../../services/api/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import BigJobLoader from '../../components/common/loader/BigJobLoader';

const SeekerPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/seeker/${id}`);
        setCandidate(res.data.data);
      } catch {
        setNotFound(true);
        toast.error('Failed to load candidate profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BigJobLoader />
      </div>
    );
  }

  if (notFound || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Candidate not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#20365c] text-white rounded-xl hover:bg-[#c7d9ff] hover:text-black transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const profile = candidate.profile || {};
  const skills = profile.skills || [];
  const experience = profile.experience || [];
  const education = profile.education || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-pink-100">
      <div className="fixed top-6 left-[200px] z-50 transition hover:scale-110">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-[#c7d9ff] transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-8 group">
          <div className="h-64 rounded-3xl bg-[#20365c] overflow-hidden"></div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -bottom-16 left-8 right-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-6">
                <img
                  src={profile.profilePhoto || 'https://via.placeholder.com/112x112?text=Photo'}
                  alt={candidate.fullName}
                  className="relative w-28 h-28 rounded-2xl border-4 border-white object-cover"
                />
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {candidate.fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    {profile.title && (
                      <span className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full text-sm">
                        <BriefcaseIcon className="h-4 w-4 mr-1 text-blue-600" />
                        {profile.title}
                      </span>
                    )}
                    <span className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full text-sm">
                      <MapPinIcon className="h-4 w-4 mr-1 text-purple-600" />
                      {candidate.location || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
              {profile.tagline && (
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <p className="italic text-gray-700">"{profile.tagline}"</p>
                </div>
              )}
            </div>
          </Motion.div>
        </div>

        <div className="h-32"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-[#20365c] mb-6">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {candidate.about || 'No description provided yet.'}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-[#20365c] mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {skills.length ? (
                  skills.map((skill, index) => (
                    <Motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      whileHover={{ scale: 1.08 }}
                      className="px-4 py-2 bg-[#20365c] text-white rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </Motion.span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </div>
            </div>

            {experience.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#20365c]">Experience</h2>
                {experience.map((exp, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#20365c] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          {exp.period && (
                            <span className="px-4 py-2 bg-blue-100 text-[#20365c] rounded-lg text-sm font-medium">
                              {exp.period}
                            </span>
                          )}
                        </div>
                        {exp.description && <p className="text-gray-700 mt-4">{exp.description}</p>}
                        {exp.achievements?.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <StarIconSolid className="h-4 w-4 text-yellow-500 mr-2" />
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start text-gray-600">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#20365c]">Education</h2>
                {education.map((edu, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#20365c] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{edu.institute}</h3>
                            <p className="text-gray-600">{edu.degree}</p>
                          </div>
                          <div className="flex gap-2">
                            {edu.year && (
                              <span className="px-4 py-2 bg-[#20365c] text-white rounded-lg text-sm font-medium">
                                {edu.year}
                              </span>
                            )}
                            {edu.grade && (
                              <span className="px-4 py-2 bg-[#c7d9ff] text-black rounded-lg text-sm font-medium">
                                {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                        {edu.description && <p className="text-gray-700 mt-4">{edu.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-[#20365c] mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{candidate.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                    <DocumentTextIcon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Resume</p>
                    {profile.resume ? (
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 underline hover:text-blue-600"
                      >
                        {profile.resumeOrignalName || 'View Resume'}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-900">No resume uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-[#20365c] mb-6">Personal Details</h3>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <span className="text-gray-600">Age</span>
                <span className="font-semibold text-gray-900">{profile.age || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerPublicProfile;
