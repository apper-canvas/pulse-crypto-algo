import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded shimmer w-32"></div>
          <div className="h-3 bg-gray-200 rounded shimmer w-24"></div>
        </div>
      </div>

      {/* Post Skeletons */}
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer w-28"></div>
              <div className="h-3 bg-gray-200 rounded shimmer w-16"></div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-200 rounded shimmer w-full"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
          </div>
          
          <div className="h-48 bg-gray-200 rounded-lg shimmer mb-4"></div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-8"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;