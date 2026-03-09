import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/components/mockData';

export default function TrendingProjects() {
  const trendingProjects = projects.slice(0, 3);
  
  // Simulated match scores
  const matchScores = [94, 87, 82];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Trend Projeler</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Bu Hafta Öne Çıkanlar
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl">
              En çok ilgi gören ve ekip arayan güncel projeler
            </p>
          </div>
          <Link to={createPageUrl('Explore') + '?tab=projects'} className="mt-4 sm:mt-0">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 group">
              Tümünü Gör
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                matchScore={matchScores[index]}
              />
            </motion.div>
          ))}
        </div>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {['TÜBİTAK 2209', 'Teknofest', 'BioTech', 'AI/ML', 'HealthTech', 'Fintech'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}