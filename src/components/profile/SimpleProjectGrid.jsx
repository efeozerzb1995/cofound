import React from 'react';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: 1,
    title: 'Yapay Et Ar-Ge',
    description: 'Hücresel tarım teknolojileri üzerine araştırma projesi.',
    tech: ['Python', 'Bioinformatik']
  },
  {
    id: 2,
    title: 'AI Sağlık Asistanı',
    description: 'Makine öğrenmesi ile hastalık teşhis sistemi.',
    tech: ['TensorFlow', 'Flask']
  },
  {
    id: 3,
    title: 'Sürdürülebilir Tarım',
    description: 'IoT sensörleri ile akıllı sera yönetimi.',
    tech: ['Arduino', 'React']
  },
  {
    id: 4,
    title: 'CoFound Platform',
    description: 'Üniversite öğrencileri için proje eşleştirme platformu.',
    tech: ['React', 'Node.js']
  }
];

export default function SimpleProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
        >
          <h4 className="text-white font-medium mb-2">{project.title}</h4>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className="bg-slate-800/50 text-slate-400 border-slate-700 text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}