import React from 'react';

export default function SkeletonProjectCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex gap-4">
        {/* Left - Image Placeholder */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* Right - Content Placeholders */}
        <div className="flex-1 space-y-3">
          {/* Title Placeholder */}
          <div className="h-5 bg-gray-200 rounded w-3/4 overflow-hidden relative">
            <div className="absolute inset-0 shimmer"></div>
          </div>

          {/* Description Placeholders */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full overflow-hidden relative">
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-5/6 overflow-hidden relative">
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-4/6 overflow-hidden relative">
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>

          {/* Action Button Placeholder */}
          <div className="pt-2">
            <div className="h-8 bg-gray-200 rounded-lg w-28 overflow-hidden relative">
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}