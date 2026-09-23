// ContactUsPage.js
import React, { useState } from 'react';
import Footer from "../../components/common/Footer/Footer";
import Navbar from "../../components/common/navbar/Navbar";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MoveRight } from 'lucide-react';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Sending message...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Message sent successfully! 🎉", {
        style: {
          background: "#c7d9ff",
          color: "#20365c",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#20365c",
          secondary: "#ffffff",
        },
      });
      setFormData({ name: "", email: "", message: "", subject: "" });
      setLoading(false);
    }, 1000);
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Add your form submission logic
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      details: "contact@careerspring.com",
      description: "Send us an email anytime, we'll respond within 24 hours"
    },
    {
      icon: "📞",
      title: "Call Us",
      details: "+92 21 3894 7765",
      description: "Mon to Fri from 9am to 6pm"
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: "Start Chat",
      description: "Chat with our support team in real-time"
    },
    {
      icon: "📍",
      title: "Visit Us",
      details: "TechnoHub Building, Shahrah-e-Faisal, Karachi, Pakistan",
      description: "Feel free to visit our office"
    }
  ];

  const faqs = [
    {
      question: "How can Hirelo help my career growth?",
      answer: "We provide personalized career guidance, skill development resources, and connect you with industry experts to accelerate your professional journey."
    },
    {
      question: "Do you offer one-on-one career coaching?",
      answer: "Yes, we offer personalized career coaching sessions with industry professionals to help you navigate career transitions and growth opportunities."
    },
    {
      question: "Are your resources free to access?",
      answer: "We offer both free and premium resources. Our blog and basic career tools are free, while personalized coaching and advanced features are part of our premium offerings."
    },
    {
      question: "How do I get started with Hirelo?",
      answer: "Simply explore our blog resources, or contact us for a free consultation to discuss your specific career goals and how we can help you achieve them."
    }
  ];
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="backdrop-blur-lg sticky top-0 z-50">
        <Navbar transparent={true} />
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#20365c] via-[#3c5275] to-[#415b80] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-gray-100 to-emerald-200 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Ready to take your career to the next level? We're here to help you succeed.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] mx-auto rounded-full shadow-lg"></div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#20365c]/10 to-[#c8d9fa]/10 rounded-full border border-[#20365c]/20 mb-6">
              <span className="text-sm font-semibold text-[#20365c]">WAYS TO CONNECT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
              Contact Methods
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
              Choose the most convenient way to reach out to our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/60 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#c7d9ff] to-[#c8d9fa] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{method.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#20365c] transition-colors duration-300">
                  {method.title}
                </h3>
                <div
                  className="text-lg font-semibold text-[#20365c] mb-2"
                  dangerouslySetInnerHTML={{ __html: method.details }}
                />
                <p className="text-gray-600 text-sm font-light">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 relative bg-gradient-to-br from-gray-50/80 via-white to-emerald-50/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/60">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
                  Send us a Message
                </h3>
                <p className="text-gray-600 font-light">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-1 focus:ring-[#20365c] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-1 focus:ring-[#20365c] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-1 focus:ring-[#20365c] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-2xl focus:ring-1 focus:ring-[#20365c] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${loading
                      ? "bg-gray-400 cursor-wait text-gray-800"
                      : "bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] text-gray-900 hover:scale-105"
                    }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/60">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
                  Our Office
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#20365c] to-[#3c5275] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Main Office</h4>
                      <p className="text-gray-600 font-light">
                        Suite 402, TechnoHub Building, Shahrah-e-Faisal, Karachi, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#20365c] to-[#3c5275] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🕒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600 font-light">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/60">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {displayedFaqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200/60 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm font-light">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-1 mt-6 text-[#20365c] font-semibold hover:text-green-800 cursor-pointer transition-colors duration-300"
                >
                  {showAll ? "Show Less FAQs" : "View All FAQs"}
                  <MoveRight></MoveRight>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#20365c]/10 to-[#c8d9fa]/10 rounded-full border border-[#20365c]/20 mb-6">
              <span className="text-sm font-semibold text-[#20365c]">VISIT US</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#20365c] to-[#3c5275] bg-clip-text ">
              Find Our Office
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/60 max-w-4xl mx-auto">
            {/* Placeholder for Map */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#20365c] to-[#3c5275] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📍</span>
                </div>
                <p className="text-gray-600 font-light text-lg">
                  Interactive Map Would Appear Here
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Suite 402, TechnoHub Building, Shahrah-e-Faisal, Karachi, Pakistan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 rounded-2xl bg-gray-50/50">
                <div className="text-2xl mb-2">🚗</div>
                <h4 className="font-semibold text-gray-800 mb-1">Parking</h4>
                <p className="text-gray-600 text-sm font-light">Free parking available in building garage</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-50/50">
                <div className="text-2xl mb-2">🚆</div>
                <h4 className="font-semibold text-gray-800 mb-1">Public Transport</h4>
                <p className="text-gray-600 text-sm font-light">5 min walk from Montgomery Station</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-50/50">
                <div className="text-2xl mb-2">♿</div>
                <h4 className="font-semibold text-gray-800 mb-1">Accessibility</h4>
                <p className="text-gray-600 text-sm font-light">Fully wheelchair accessible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative bg-gradient-to-br from-gray-900 via-[#243550] to-[#20365c] text-white overflow-hidden">
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <span className="text-sm font-semibold text-white">READY TO BEGIN?</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-[#c8d9fa] bg-clip-text text-transparent leading-tight">
              Start Your Career Journey Today
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Don't wait to transform your career. Reach out now and let's build your success story together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/about"
                className="px-12 py-5 bg-gradient-to-r from-[#c7d9ff] to-[#c8d9fa] text-gray-900 font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg shadow-lg"
              >
                Learn About Us
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-12 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-[#20365c] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm text-lg"
              >
                Contact Us Again
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;