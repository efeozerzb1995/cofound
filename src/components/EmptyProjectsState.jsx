import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function EmptyProjectsState() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[600px] py-16 px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Left Figure */}
            <circle cx="60" cy="50" r="20" fill="#1A365D" opacity="0.9" />
            <rect x="40" y="75" width="40" height="60" rx="8" fill="#1A365D" opacity="0.9" />
            
            {/* Left Puzzle Piece */}
            <g transform="translate(95, 85)">
              <path d="M 0 0 L 30 0 L 30 10 Q 35 10 35 15 Q 35 20 30 20 L 30 40 L 0 40 L 0 20 L -5 20 Q -10 15 -5 10 L 0 10 Z" 
                    fill="#10B981" opacity="0.8" />
            </g>
            
            {/* Right Puzzle Piece */}
            <g transform="translate(155, 85)">
              <path d="M 0 0 L 5 0 Q 10 5 5 10 L 0 10 L 0 20 Q 5 20 5 25 Q 5 30 0 30 L 0 40 L -30 40 L -30 0 Z" 
                    fill="#10B981" opacity="0.8" />
            </g>
            
            {/* Right Figure */}
            <circle cx="220" cy="50" r="20" fill="#1A365D" opacity="0.9" />
            <rect x="200" y="75" width="40" height="60" rx="8" fill="#1A365D" opacity="0.9" />
            
            {/* Glowing Connection Line */}
            <line x1="125" y1="105" x2="155" y2="105" 
                  stroke="url(#glowGradient)" strokeWidth="3" strokeLinecap="round" />
            
            {/* Subtle sparkles around connection */}
            <circle cx="132" cy="98" r="2" fill="#10B981" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="148" cy="112" r="2" fill="#10B981" opacity="0.6">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="95" r="1.5" fill="#10B981" opacity="0.5">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </circle>
            
            {/* Decorative dots suggesting movement */}
            <circle cx="115" cy="105" r="3" fill="#10B981" opacity="0.3" />
            <circle cx="107" cy="105" r="2" fill="#10B981" opacity="0.2" />
            <circle cx="165" cy="105" r="3" fill="#10B981" opacity="0.3" />
            <circle cx="173" cy="105" r="2" fill="#10B981" opacity="0.2" />
          </svg>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Henüz Bir Ekibin Parçası Değilsin
        </h2>

        {/* Body Text */}
        <p className="text-slate-600 text-base leading-relaxed mb-8 px-4">
          Büyük fikirler tek başına hayata geçmez. Hemen yeteneklerine uygun bir proje aramaya başla.
        </p>

        {/* Call to Action Button */}
        <Button
          onClick={() => navigate(createPageUrl('Explore'))}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 text-base shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
        >
          Projeleri Keşfet
        </Button>
      </div>
    </div>
  );
}