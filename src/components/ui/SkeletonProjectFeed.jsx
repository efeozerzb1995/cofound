import React from 'react';
import SkeletonProjectCard from './SkeletonProjectCard';

export default function SkeletonProjectFeed() {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonProjectCard />
        <SkeletonProjectCard />
        <SkeletonProjectCard />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}