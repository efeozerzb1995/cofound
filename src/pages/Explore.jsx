import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Briefcase, Users, Mic, ArrowRight, X } from 'lucide-react';
import ProjectCard from '@/components/ui/ProjectCard';
import UserCard from '@/components/ui/UserCard';
import FilterPanel from '@/components/explore/FilterPanel';
import { projects, calculateMatchScore } from '@/components/mockData';
import { supabase } from '@/lib/supabase';

const currentUserProfile = {
  skills: ['Python', 'Biyoinformatik', 'Veri Analizi', 'Hücre Kültürü'],
  interests: ['BioTech', 'Rejeneratif Tıp', 'Yapay Et']
};

const defaultFilters = {
  category: 'Tümü',
  stage: 'Tümü',
  role: 'Tümü',
};

export default function Explore() {
  const [activeMainTab, setActiveMainTab] = useState('projects');
  const [activeProjectTab, setActiveProjectTab] = useState('foryou');
  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'talent') setActiveMainTab('talent');
  }, []);

  // Load public profiles and their skills from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const { data: profilesData, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, full_name, title, university, location, about, website_url, github_url, linkedin_url, avatar_url');

        if (profileError) throw profileError;

        const profiles = profilesData || [];
        if (profiles.length === 0) {
          setUsers([]);
          setUsersLoading(false);
          return;
        }

        const userIds = profiles.map((p) => p.user_id);
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('user_id, name')
          .in('user_id', userIds)
          .order('created_at', { ascending: true });

        if (skillsError) throw skillsError;

        const skillsByUser = (skillsData || []).reduce((acc, row) => {
          if (!acc[row.user_id]) acc[row.user_id] = [];
          acc[row.user_id].push(row.name);
          return acc;
        }, {});

        const mapped = profiles.map((p) => {
          const portfolio = [
            ...(p.github_url ? [{ type: 'github', url: p.github_url }] : []),
            ...(p.linkedin_url ? [{ type: 'linkedin', url: p.linkedin_url }] : []),
            ...(p.website_url ? [{ type: 'website', url: p.website_url }] : []),
          ];
          return {
            id: p.user_id,
            name: p.full_name || 'Kullanıcı',
            title: p.title || '',
            university: p.university || '',
            location: p.location || '',
            avatar: p.avatar_url || '',
            bio: p.about || '',
            skills: skillsByUser[p.user_id] || [],
            interests: [],
            portfolio,
          };
        });
        setUsers(mapped);
      } catch (err) {
        console.error('Explore: load users error', err);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Close filter panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeFilterCount = Object.entries(filters).filter(([, v]) => v !== 'Tümü').length;

  const filteredProjects = useMemo(() => {
    return projects
      .map(project => ({
        ...project,
        matchScore: calculateMatchScore(
          currentUserProfile.skills,
          currentUserProfile.interests,
          project.skills,
          project.tags
        )
      }))
      .filter(project => {
        const matchesCategory = filters.category === 'Tümü' || project.category === filters.category;
        const matchesStage = filters.stage === 'Tümü' || project.stage === filters.stage ||
          project.stage?.toLowerCase().startsWith(filters.stage.toLowerCase());
        const matchesRole = filters.role === 'Tümü' ||
          project.seeking?.some(r => r.toLowerCase().includes(filters.role.toLowerCase()) ||
            filters.role.toLowerCase().includes(r.toLowerCase()));
        const matchesSearch = !searchQuery || searchQuery.length < 3 ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesStage && matchesRole && matchesSearch;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [filters, searchQuery]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = !searchQuery || searchQuery.length < 3 ||
          (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.university || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.skills || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [users, searchQuery]);

  const forYouProjects = filteredProjects.filter(p => p.matchScore >= 85);
  const displayedProjects = activeProjectTab === 'foryou' ? forYouProjects : filteredProjects;

  const removeFilter = (key) => setFilters(prev => ({ ...prev, [key]: 'Tümü' }));

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <button
            onClick={() => { setActiveMainTab('projects'); setActiveProjectTab('foryou'); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              activeMainTab === 'projects' && activeProjectTab === 'foryou'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            Projects for you
          </button>
          <button
            onClick={() => { setActiveMainTab('projects'); setActiveProjectTab('all'); }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeMainTab === 'projects' && activeProjectTab === 'all'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            All projects
          </button>
          <button
            onClick={() => setActiveMainTab('talent')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeMainTab === 'talent'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1.5" />
            Yetenekler
          </button>
        </div>

        {/* AI Search bar + Filter button */}
        <div className="mb-4" ref={filterRef}>
          <p className="text-slate-500 text-xs mb-2">AI Search (min 3 characters)</p>
          <div className="relative flex items-center bg-slate-900/70 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Filter trigger */}
            <button
              onClick={() => setFilterOpen(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-3.5 border-r border-slate-700/50 transition-colors flex-shrink-0 ${
                filterOpen || activeFilterCount > 0
                  ? 'text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Filtrele</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <input
              type="text"
              placeholder="e.g. BioTech projeleri göster, ücretli roller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none text-sm"
            />
            <div className="flex items-center gap-2 px-4">
              <button className="text-slate-500 hover:text-slate-300 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Filter Panel dropdown */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onClose={() => setFilterOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, val]) => {
              if (val === 'Tümü') return null;
              const labels = { category: 'Kategori', stage: 'Aşama', role: 'Rol' };
              return (
                <span
                  key={key}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-full"
                >
                  <span className="text-indigo-500">{labels[key]}:</span> {val}
                  <button onClick={() => removeFilter(key)} className="hover:text-white transition-colors ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setFilters(defaultFilters)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Temizle
            </button>
          </div>
        )}

        {/* Results count */}
        {activeMainTab === 'projects' && (
          <p className="text-slate-500 text-sm text-center mb-6">
            Projects found by algorithm: <span className="text-white font-medium">{filteredProjects.length}</span>
          </p>
        )}

        {/* Projects Grid */}
        {activeMainTab === 'projects' && (
          <>
            {displayedProjects.length > 0 ? (
              <div className="columns-1 md:columns-2 gap-5">
                {displayedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="break-inside-avoid mb-5"
                  >
                    <ProjectCard
                      project={project}
                      matchScore={project.matchScore}
                      showAIBadge={project.matchScore >= 85}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">Filtrelere uygun proje bulunamadı</p>
              </div>
            )}
          </>
        )}

        {/* Talent Grid */}
        {activeMainTab === 'talent' && (
          <>
            {usersLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin mb-4" />
                <p className="text-slate-500">Yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <UserCard user={user} />
                    </motion.div>
                  ))}
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-20">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">
                      {users.length === 0 ? 'Henüz profil yok' : 'Aramaya uygun yetenek bulunamadı'}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}