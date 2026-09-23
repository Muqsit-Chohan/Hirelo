import React from "react";
import Footer from "../../components/common/Footer/Footer";
import { Link } from "react-router-dom";
import AbdulMuqsit from "../..//assets/images/AbdulMuqsit.jpg";
import adnanShah from "../../assets/images/adnanShah.jpeg";
import Navbar from "../../components/common/navbar/Navbar";

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Hassan Shah",
      role: "Backend Developer & Technical Lead",
      image: adnanShah,
      bio: "Hassan is a skilled backend developer who focuses on building robust, secure, and efficient server-side systems. He specializes in creating scalable APIs and ensuring seamless data flow across the platform.",
    },
    {
      id: 2,
      name: "Abdul Muqsit",
      role: "Frontend Developer & UI/UX Specialist",
      image: AbdulMuqsit,
      bio: "Abdul is a creative frontend developer with a keen eye for design and user experience. He ensures every interface is intuitive, visually appealing, and optimized for performance and responsiveness.",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Mission",
      description:
        "To empower professionals with the tools, knowledge, and confidence to build fulfilling careers in today's dynamic job market.",
    },
    {
      icon: "👁️",
      title: "Vision",
      description:
        "A world where every professional has access to the resources and guidance needed to achieve their career aspirations.",
    },
    {
      icon: "💎",
      title: "Values",
      description:
        "Integrity, innovation, empathy, and excellence guide everything we do at CareerHub.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg shadow-md">
        <Navbar transparent={true} />
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-28 bg-gradient-to-br from-[#0a192f] via-[#30425f] to-[#20365c] text-white overflow-hidden">
        {/* Animated Background Dots */}
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.25'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#f5f5f5] via-[#c8d9fa] to-[#c7d9ff] bg-clip-text text-transparent animate-gradient-x">
            About Hirelo
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            We're on a mission to transform career journeys and empower
            professionals worldwide.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] mx-auto rounded-full shadow-lg"></div>
        </div>
      </section>

      {/* ================= MISSION / VALUES ================= */}
      <section className="py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#20365c]/10 to-[#c8d9fa]/10 rounded-full border border-[#20365c]/20 mb-6">
              <span className="text-sm font-semibold text-[#20365c]">
                OUR FOUNDATION
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
              Guiding Principles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
              The foundation of everything we do at Hirelo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-200/60 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f5] to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 flex justify-center items-center transform group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-4 group-hover:text-[#20365c] transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center font-light text-lg">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-20 bg-gradient-to-br from-[#f5f5f5] via-white to-[#edf7ef] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#20365c]/10 to-[#c8d9fa]/10 rounded-full border border-[#20365c]/20 mb-6">
              <span className="text-sm font-semibold text-[#20365c]">
                MEET THE TEAM
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
              Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
              Passionate professionals dedicated to helping you succeed in your
              career journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <p className="text-sm text-gray-700 font-medium text-center">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#20365c] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="px-4 py-2 bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] text-gray-900 rounded-full text-sm font-semibold inline-block mb-4 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 relative bg-gradient-to-br from-[#0a192f] via-[#30425f] to-[#20365c] text-white overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zM48 43c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23f5d142' fill-opacity='0.15'/%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-[#c8d9fa] to-[#c7d9ff] bg-clip-text text-transparent">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have already advanced their
            careers with Hirelo.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/blogs"
              className="px-12 py-5 bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] text-gray-900 font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg shadow-lg"
            >
              Read Career Insights
            </Link>
            <Link to={"/contactus"} className="px-12 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-[#20365c] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
