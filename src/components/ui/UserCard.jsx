import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  GraduationCap,
  MapPin,
  Github,
  Linkedin,
  Globe,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserCard({ user, onViewProfile }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(createPageUrl('PublicProfile'), { state: { user } });
  };
  const getPortfolioIcon = (type) => {
    switch(type) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
        <CardContent className="p-0">
          {/* Match Score Banner */}
          {user.matchScore && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-4 py-2 flex items-center gap-2 border-b border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">%{user.matchScore} Uyum</span>
            </div>
          )}
          
          <div className="p-5">
            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-slate-600 ring-2 ring-emerald-500/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-slate-700 text-slate-300">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {user.name}
                </h3>
                <p className="text-emerald-400 text-sm font-medium">{user.title}</p>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user.university || '—'}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {(user.bio != null && user.bio !== '') && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {user.bio}
              </p>
            )}

            {/* Skills */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Yetenekler:</p>
              <div className="flex flex-wrap gap-1.5">
                {(user.skills || []).slice(0, 4).map((skill, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-slate-700/50 text-slate-300 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
                {(user.skills || []).length > 4 && (
                  <Badge className="bg-slate-700/50 text-slate-400 text-xs">
                    +{(user.skills || []).length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Interests */}
            {(user.interests || []).length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">İlgi Alanları:</p>
              <div className="flex flex-wrap gap-1.5">
                {(user.interests || []).slice(0, 3).map((interest, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-700/50 pt-4 mt-4">
              {/* Portfolio Links */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {(user.portfolio || []).map((item, idx) => (
                    <a
                      key={idx}
                      href={`https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                    >
                      {getPortfolioIcon(item.type)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleViewProfile}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group/btn"
              >
                Profili İncele
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}