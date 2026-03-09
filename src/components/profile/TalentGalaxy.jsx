import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from 'lucide-react';

export default function TalentGalaxy({ user, skills }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent" />
      
      {/* Center Node (Sun/Profile Picture) */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="relative">
          {/* Glowing Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 blur-xl opacity-30 animate-pulse" />
          
          {/* Profile Picture */}
          <Avatar className="w-32 h-32 border-4 border-emerald-400/30 ring-4 ring-emerald-500/20 relative z-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-slate-700 text-white text-3xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* Verification Badge */}
          {localStorage.getItem('ekipbul_user_verified') === 'true' && (
            <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1">
              <BadgeCheck className="w-8 h-8 text-blue-400" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Orbiting Skills (Planets) */}
      {skills.slice(0, 8).map((skill, index) => {
        const angle = (360 / Math.min(skills.length, 8)) * index;
        const radius = 180;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: x,
              y: y,
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.1,
              type: "spring",
            }}
            onMouseEnter={() => setHoveredSkill(index)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {/* Orbit Animation */}
            <motion.div
              animate={hoveredSkill !== index ? {
                rotate: 360,
              } : {}}
              transition={{
                duration: 20 + index * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Skill Bubble */}
              <motion.div
                className="relative"
                animate={hoveredSkill === index ? { scale: 1.2 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 blur-lg opacity-50 rounded-full" />
                
                {/* Skill Node */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-400/50 rounded-full px-4 py-2 shadow-lg">
                  <p className="text-xs font-medium text-white whitespace-nowrap">
                    {skill}
                  </p>
                </div>

                {/* Tooltip */}
                {hoveredSkill === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-emerald-400/30 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-20"
                  >
                    <p className="text-xs text-emerald-400 font-medium">✓ Onaylı Yetenek</p>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 border-t border-l border-emerald-400/30 rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Connecting Lines (Optional - subtle) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        {skills.slice(0, 8).map((_, index) => {
          const angle = (360 / Math.min(skills.length, 8)) * index;
          const radius = 180;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <line
              key={index}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${x}px)`}
              y2={`calc(50% + ${y}px)`}
              stroke="url(#gradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}