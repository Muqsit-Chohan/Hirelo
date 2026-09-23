import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  GlobeAltIcon,
  SparklesIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import API from '../../services/api/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import BigJobLoader from '../../components/common/loader/BigJobLoader';

const CompanyPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/company/${id}`);
        setCompany(res.data.data);
      } catch {
        setNotFound(true);
        toast.error('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BigJobLoader />
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Company not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#20365c] text-white rounded-xl hover:bg-[#c7d9ff] hover:text-black transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

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
        {/* Company Header */}
        <div className="relative mb-8 group">
          <div className="h-64 rounded-3xl bg-[#20365c] overflow-hidden relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -bottom-20 left-8 right-8">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#20365c] to-[#c7d9ff] rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={company?.profile?.profilePhoto || 'https://via.placeholder.com/112x112?text=Company'}
                      alt={company.companyName}
                      className="relative w-28 h-28 rounded-2xl border-4 border-white object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">{company?.companyName || 'Company Name'}</h1>

                    <div className="flex flex-wrap items-center gap-3">
                      {company?.companyProfile?.industry && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1 text-blue-600" />
                          <span>{company.companyProfile.industry}</span>
                        </span>
                      )}

                      <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1 text-green-600" />
                        <span>{company?.location || 'Location not provided'}</span>
                      </span>

                      {company?.companyProfile?.foundedYear && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1 text-purple-600" />
                          <span>Founded {company.companyProfile.foundedYear}</span>
                        </span>
                      )}

                      {company?.companyProfile?.companySize && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{company.companyProfile.companySize} employees</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {company?.profile?.tagline && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="relative">
                    <SparklesIcon className="absolute -left-2 -top-2 h-6 w-6 text-blue-600" />
                    <p className="text-gray-600 pl-8 break-words">{company.profile.tagline}</p>
                  </div>
                </div>
              )}
            </div>
          </Motion.div>
        </div>

        <div className="h-28"></div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Company</h2>
              <p className="text-gray-700 leading-relaxed text-lg break-words">
                {company?.about || 'This company has not added a description yet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-full border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  </span>
                  Our Mission
                </h3>
                <p className="text-gray-600 break-words">{company?.companyProfile?.mission || 'No mission statement added yet'}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <GlobeAltIcon className="h-5 w-5 text-purple-600" />
                  </span>
                  Our Vision
                </h3>
                <p className="text-gray-600 break-words">{company?.companyProfile?.vision || 'No vision statement added yet'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <EnvelopeIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{company?.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{company?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <GlobeAltIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Website</p>
                    {company?.companyProfile?.website ? (
                      <a href={company.companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#20365c] hover:underline">
                        {company.companyProfile.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(company?.companyProfile?.socialLinks?.linkedin || company?.companyProfile?.socialLinks?.twitter || company?.companyProfile?.socialLinks?.facebook) && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Social Media</h3>
                <div className="space-y-3">
                  {company?.companyProfile?.socialLinks?.linkedin && (
                    <div>
                      <label className="text-md text-black font-black">LinkedIn</label>
                      <a href={company.companyProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1">
                        {company.companyProfile.socialLinks.linkedin}
                      </a>
                    </div>
                  )}
                  {company?.companyProfile?.socialLinks?.twitter && (
                    <div>
                      <label className="text-md text-black font-black">Twitter/X</label>
                      <a href={company.companyProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1">
                        {company.companyProfile.socialLinks.twitter}
                      </a>
                    </div>
                  )}
                  {company?.companyProfile?.socialLinks?.facebook && (
                    <div>
                      <label className="text-md font-black text-black">Facebook</label>
                      <a href={company.companyProfile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1">
                        {company.companyProfile.socialLinks.facebook}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
