import React from 'react'

const HeroSection = ({title = "Our Latest Blogs"}) => {
  return (
    <section className="bg-[#20365c] text-white py-20 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      {title}
    </h1>
    <p className="text-gray-200 max-w-2xl mx-auto text-lg">
      Explore expert advice to boost your career, land jobs, and grow professionally.
    </p>
  </section>
)
}

export default HeroSection;