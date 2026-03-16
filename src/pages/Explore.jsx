import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Briefcase, Users, Mic, ArrowRight, X } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import ProjectCard from '@/components/ui/ProjectCard';
import UserCard from '@/components/ui/UserCard';
import FilterPanel from '@/components/explore/FilterPanel';
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

const QUERY_TIMEOUT_MS = 5000;

async function withTimeout(promise, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error(`[Explore] ${label} timed out after ${QUERY_TIMEOUT_MS}ms`);
      console.error(err);
      reject(err);
    }, QUERY_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export default function Explore() {
  const { isLoading, user } = useRequireAuth();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
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

  // Load projects from Supabase and enrich with owner profiles for profile links
  useEffect(() => {
    const loadProjects = async () => {
      console.log('[Explore] loadProjects: start');
      setProjectsLoading(true);
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('projects')
            .select(
              'id, owner_id, title, description, category, program, location, stage, is_paid, seeking, skills, tags, created_at, updated_at',
            ),
          'projects select',
        );

        console.log('[Explore] loadProjects: result', {
          error: error || null,
          count: data?.length ?? 0,
        });
        if (error) throw error;
        const rawProjects = data || [];
        const ownerIds = [...new Set(rawProjects.map((p) => p.owner_id).filter(Boolean))];
        let ownerMap = {};
        console.log('[Explore] loadProjects: unique ownerIds', ownerIds);
        if (ownerIds.length > 0) {
          const { data: profilesData, error: profileError } = await withTimeout(
            supabase
              .from('profiles')
              .select(
                'user_id, full_name, title, university, location, about, website_url, github_url, linkedin_url, avatar_url',
              )
              .in('user_id', ownerIds),
            'owner profiles select',
          );
          console.log('[Explore] loadProjects: owner profiles result', {
            profileError: profileError || null,
            count: profilesData?.length ?? 0,
          });
          if (!profileError && profilesData) {
            ownerMap = profilesData.reduce((acc, p) => {
              acc[p.user_id] = {
                id: p.user_id,
                name: p.full_name || 'Kullanıcı',
                title: p.title || '',
                university: p.university || '',
                location: p.location || '',
                avatar: p.avatar_url || '',
                bio: p.about || '',
                portfolio: [
                  ...(p.github_url ? [{ type: 'github', url: p.github_url }] : []),
                  ...(p.linkedin_url ? [{ type: 'linkedin', url: p.linkedin_url }] : []),
                  ...(p.website_url ? [{ type: 'website', url: p.website_url }] : []),
                ],
              };
              return acc;
            }, {});
          }
        }
        const mapped = rawProjects.map((p) => ({
          ...p,
          owner: ownerMap[p.owner_id] || null,
        }));
        console.log('[Explore] loadProjects: final mapped projects', {
          count: mapped.length,
        });
        setProjects(
          rawProjects.map((p) => ({
            ...p,
            owner: ownerMap[p.owner_id] || null,
          }))
        );
      } catch (err) {
        console.error('Explore: load projects error', err);
        setProjects([]);
      } finally {
        console.log('[Explore] loadProjects: finished');
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Load public profiles and their skills from Supabase
  useEffect(() => {
    if (!user) {
      console.log('[Explore] loadUsers: skipped because no user');
      return;
    }
    const loadUsers = async () => {
      console.log('[Explore] loadUsers: start for user', { userId: user.id });
      setUsersLoading(true);
      try {
        const { data: profilesData, error: profileError } = await withTimeout(
          supabase
            .from('profiles')
            .select(
              'user_id, full_name, title, university, location, about, website_url, github_url, linkedin_url, avatar_url',
            ),
          'profiles select (talent)',
        );

        console.log('[Explore] loadUsers: profiles result', {
          profileError: profileError || null,
          count: profilesData?.length ?? 0,
        });
        if (profileError) throw profileError;

        const profiles = profilesData || [];
        if (profiles.length === 0) {
          console.log('[Explore] loadUsers: no profiles found');
          setUsers([]);
          setUsersLoading(false);
          return;
        }

        const userIds = profiles.map((p) => p.user_id);
        console.log('[Explore] loadUsers: userIds for skills', userIds);
        const { data: skillsData, error: skillsError } = await withTimeout(
          supabase
            .from('skills')
            .select('user_id, name')
            .in('user_id', userIds)
            .order('created_at', { ascending: true }),
          'skills select',
        );

        console.log('[Explore] loadUsers: skills result', {
          skillsError: skillsError || null,
          count: skillsData?.length ?? 0,
        });
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
        console.log('[Explore] loadUsers: final mapped users', {
          count: mapped.length,
        });
        setUsers(mapped);
      } catch (err) {
        console.error('Explore: load users error', err);
        setUsers([]);
      } finally {
        console.log('[Explore] loadUsers: finished');
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, [user]);

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

  const calculateMatchScore = (userSkills, userInterests, projectSkills = [], projectTags = []) => {
    const uSkills = userSkills || [];
    const uInterests = userInterests || [];
    const pSkills = projectSkills || [];
    const pTags = projectTags || [];

    const skillOverlap = uSkills.filter(skill => 
      pSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(pSkill.toLowerCase()))
    ).length;
    
    const interestOverlap = uInterests.filter(interest =>
      pTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(tag.toLowerCase()))
    ).length;
    
    const maxScore = Math.max(uSkills.length, pSkills.length) + Math.max(uInterests.length, pTags.length) || 1;
    const score = ((skillOverlap * 2 + interestOverlap * 1.5) / maxScore) * 100;
    
    return Math.min(Math.round(score + 60), 99); // Base score + calculated, max 99
  };

  const filteredProjects = useMemo(() => {
    return projects
      .map(project => ({
        ...project,
        matchScore: calculateMatchScore(
          currentUserProfile.skills,
          currentUserProfile.interests,
          project.skills || [],
          project.tags || []
        )
      }))
      .filter(project => {
        const matchesCategory = filters.category === 'Tümü' || project.category === filters.category;
        const matchesStage = filters.stage === 'Tümü' || project.stage === filters.stage ||
          project.stage?.toLowerCase().startsWith(filters.stage.toLowerCase?.());
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
  }, [filters, searchQuery, projects]);

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

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