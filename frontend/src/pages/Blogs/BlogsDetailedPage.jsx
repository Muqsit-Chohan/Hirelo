import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/jobs/SearchBar/searchBar'
import Navbar from '../../components/common/navbar/Navbar'
// import DetailHeader from "./DetailHeader"
import BigJobLoader from "../../components/common/loader/BigJobLoader"
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle, MoveLeftIcon } from 'lucide-react';
import NoJobFound from "../../components/common/loader/NoJobsFound"
const BlogsDetailedPage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backLoading, setBackLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://dev.to/api/articles/${id}`)
        const data = await response.json()
        setArticle(data);
      }
      catch {
        navigate('/');
      }
      finally {
        setLoading(false);

      }
    }
    fetchArticle()
  }, [id, navigate])

  const handleBack = () => {
    setBackLoading(true);
    setTimeout(() => {
      navigate(-1)
    }, 2000);
  }
  // if (loading)
  // return (
  //   <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
  //     <BigJobLoader></BigJobLoader>
  //   </div>
  // );
  //  if (!article)
  // return (
  //   <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
  //     <NoJobFound></NoJobFound>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <DetailHeader /> */}
      <div className='p-5 bg-[#20365c]'>
        <Navbar></Navbar>
      </div>
      {loading ?
        (
          <BigJobLoader></BigJobLoader>
        ) : !article ? (
          <div className="flex justify-center items-center py-16">
            <NoJobFound />
          </div>
        ) : (
          <article className="max-w-4xl mx-auto p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="text-gray-600 mb-6">{article.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    article.user.profile_image_90 ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      article.user.name
                    )}&background=244034&color=fff`
                  }
                  alt={article.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">{article.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(article.published_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {article.reading_time_minutes} min read
              </span>
            </div>

            <img
              src={
                article.cover_image ||
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80'
              }
              alt={article.title}
              className="w-full rounded-2xl mb-8 shadow-sm"
            />

            <div
              className="prose max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />

            <div className="mt-10 flex justify-center items-center">
              <button
                onClick={handleBack}
                disabled={backLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${backLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#20365c] hover:bg-[#c7d9ff] hover:text-black text-white"
                  }`}
              >
                {backLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Going Back...
                  </>
                ) :
                  (
                    <>
                      <MoveLeftIcon /> Back
                    </>
                  )}
              </button>
            </div>
          </article>
        )}
    </div>
  )
}

export default BlogsDetailedPage