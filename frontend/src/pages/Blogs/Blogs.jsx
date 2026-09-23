import React, { useEffect, useState, useCallback } from 'react'
import Footer from "../../components/common/Footer/Footer";
import BigJobLoader from '../../components/common/loader/BigJobLoader';
import HeroSection from './HeroSection';
import { Link,useLocation } from 'react-router-dom';
import Navbar from '../../components/common/navbar/Navbar';

const Blogs = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("All");

  const location =useLocation()
  // const queryParams = new URLSearchParams(location.search)
   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    setCategory(cat || "All");
  }, [location]);

  const fetchArticles = useCallback(async (pageNum = 1, append = false) => {
    try {
       setLoading(pageNum === 1); // show loader only on first load
      setLoadingMore(pageNum > 1);
      const tag = category === "All" ? "career" : category.toLowerCase().replace(/\s+/g, "-");
      const res = await fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=12&page=${pageNum}`);
      if (!res.ok) {
        throw new Error('Failed to load blogs.');
      }
      const data = await res.json();
      setHasMore(data.length === 12);
      setError(null);
      setArticles((prev) => (append ? [...prev, ...data] : data))
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);

    }
  }, [category]);
  useEffect(() => {
    setLoading(true);
    setHasMore(true);
    setPage(1);
    fetchArticles(1);

  }, [fetchArticles]);
  const handleLoadMore = () => {
    setLoadingMore(true); // 👈 Add this line
    setTimeout(() => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage, true);
    }, 2000);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#20365c] text-white px-6 py-2 rounded-lg hover:bg-[#263953] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );




  // return (
  //   <div className="min-h-screen flex items-center justify-center text-center">
  //     <div>
  //       <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
  //       <button
  //         onClick={() => window.location.reload()}
  //         className="bg-[#20365c] text-white px-6 py-2 rounded-lg hover:bg-[#263953] transition"
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <Navbar></Navbar>
      <HeroSection title={`${category === "All" ? "Our Latest" : category} Blogs`} /> 
      {loading ? (
        <BigJobLoader></BigJobLoader>
      ) : (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  to={`/blog/${article.id}`}
                  key={article.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
                >
                  <img
                    src={
                      article.cover_image ||
                      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'
                    }
                    alt={article.title}
                    className="h-48 w-full object-cover rounded-t-2xl"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span>Career</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#20365c] line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.description || 'Read this insightful career article.'}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            article.user.profile_image_90 ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              article.user.name
                            )}&background=244034&color=fff`
                          }
                          alt={article.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{article.user.name}</span>
                      </div>
                      <span>{article.reading_time_minutes} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                {loadingMore ? (
                  <div className="flex flex-col items-center gap-2">
                    {/* Smaller Loader */}
                    <div className="w-8 h-8 border-4 border-[#20365c] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-sm font-medium">Loading more blogs...</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setLoadingMore(true);
                      setTimeout(() => {
                        handleLoadMore();
                      }, 1000);
                    }}
                    disabled={loadingMore}
                    className="bg-[#20365c] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#c7d9ff] hover:text-black transition"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}


          </div>
        </section>
      )}
      {/* <Footer /> */}
      <Footer></Footer>
    </div>
  );
}

export default Blogs
