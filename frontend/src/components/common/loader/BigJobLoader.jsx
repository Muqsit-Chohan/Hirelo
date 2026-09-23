import React from "react";

const BigJobLoader = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-6 gap-4 animate-pulse">
      
      {/* Job Title */}
      <div className="relative w-3/4 h-12 bg-gray-300 rounded-lg overflow-hidden shimmer"></div>

      {/* Company Name */}
      <div className="relative w-2/3 h-6 bg-gray-300 rounded-lg overflow-hidden shimmer"></div>

      {/* Job Location */}
      <div className="relative w-1/2 h-6 bg-gray-300 rounded-lg overflow-hidden shimmer"></div>

      {/* Job Description */}
      <div className="relative w-full h-48 bg-gray-300 rounded-lg overflow-hidden mt-4 shimmer"></div>

      {/* Responsibilities / Skills */}
      <div className="flex flex-col gap-2 mt-2 w-full">
        <div className="relative h-6 w-5/6 bg-gray-300 rounded-lg overflow-hidden shimmer"></div>
        <div className="relative h-6 w-4/6 bg-gray-300 rounded-lg overflow-hidden shimmer"></div>
      </div>
    </div>
  );
};

export default BigJobLoader;
