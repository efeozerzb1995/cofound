import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

export default function UserProfileCard({ 
  user = {
    name: 'Dr. Selin Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    role: 'Moleküler Biyolog @ İTÜ',
    skills: ['CRISPR', 'Python', 'Veri Analizi'],
    isVerified: true
  },
  onConnect
}) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100">
      <div className="flex items-center gap-6">
        {/* Left Section - Identity */}
        <div className="flex-shrink-0 relative">
          <Avatar className="h-20 w-20 border-2 border-slate-100">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-slate-200 text-slate-700 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {/* Verified Badge - Bottom Right Corner */}
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
              <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500" />
            </div>
          )}
        </div>

        {/* Middle Section - Info & Skills */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
            {user.name}
          </h3>
          
          {/* Role/Tagline */}
          <p className="text-sm text-slate-600 mb-3 truncate">
            {user.role}
          </p>
          
          {/* Skill Badges */}
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium px-3 py-1"
              >
                #{skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right Section - Action */}
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={onConnect}
            className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold px-6"
          >
            Bağlantı Kur
          </Button>
        </div>
      </div>
    </div>
  );
}