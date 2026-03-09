import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight, SlidersHorizontal, Star } from 'lucide-react';
import { universities, categories, programs, locations, teamSizes, stages, positionTypes } from '@/components/mockData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

export default function FilterSection({ 
  filters, 
  setFilters, 
  searchQuery, 
  setSearchQuery,
  onClearFilters,
  totalResults 
}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="mb-8 space-y-4">
      {/* AI Search Bar */}
      <div className="relative">
        <div className="bg-slate-900/60 border-2 border-slate-700/50 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-all">
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500 mb-2">AI Arama (min 3 karakter)</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="ör: Ücretli projeler göster"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-base outline-none"
              />
              <Popover open={showSettings} onOpenChange={setShowSettings}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm font-medium">Ayarlar</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 bg-slate-800 border-slate-700 p-4"
                  align="end"
                >
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <h3 className="font-semibold text-white text-sm mb-3">Filtreler</h3>
                    
                    {/* AI Rating Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        AI Rating (Min: {filters.aiRating || 0})
                      </label>
                      <Slider
                        value={[filters.aiRating || 0]}
                        onValueChange={(value) => setFilters({...filters, aiRating: value[0]})}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0</span>
                        <span>5.0</span>
                      </div>
                    </div>

                    {/* Position Type Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Open Positions</label>
                      <Select 
                        value={filters.positionType} 
                        onValueChange={(value) => setFilters({...filters, positionType: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Pozisyon tipi" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {positionTypes.map((type) => (
                            <SelectItem 
                              key={type} 
                              value={type}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Kategori</label>
                      <Select 
                        value={filters.category} 
                        onValueChange={(value) => setFilters({...filters, category: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Kategori seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {categories.map((cat) => (
                            <SelectItem 
                              key={cat} 
                              value={cat}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Lokasyon</label>
                      <Select 
                        value={filters.location} 
                        onValueChange={(value) => setFilters({...filters, location: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Lokasyon seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {locations.map((loc) => (
                            <SelectItem 
                              key={loc} 
                              value={loc}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Size Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Takım Büyüklüğü</label>
                      <Select 
                        value={filters.teamSize} 
                        onValueChange={(value) => setFilters({...filters, teamSize: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Takım büyüklüğü seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {teamSizes.map((size) => (
                            <SelectItem 
                              key={size} 
                              value={size}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Stage Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Aşama</label>
                      <Select 
                        value={filters.stage} 
                        onValueChange={(value) => setFilters({...filters, stage: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Aşama seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {stages.map((stage) => (
                            <SelectItem 
                              key={stage} 
                              value={stage}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* University Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Üniversite</label>
                      <Select 
                        value={filters.university} 
                        onValueChange={(value) => setFilters({...filters, university: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Üniversite seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {universities.map((uni) => (
                            <SelectItem 
                              key={uni} 
                              value={uni}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {uni}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Program Filter */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Program</label>
                      <Select 
                        value={filters.program} 
                        onValueChange={(value) => setFilters({...filters, program: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Program seç" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {programs.map((prog) => (
                            <SelectItem 
                              key={prog} 
                              value={prog}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {prog}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters Button */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        onClearFilters();
                        setShowSettings(false);
                      }}
                      className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-600 rounded-full p-2 transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {totalResults !== undefined && (
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Algoritma tarafından bulunan projeler: <span className="text-white font-semibold">{totalResults}</span>
          </p>
        </div>
      )}
    </div>
  );
}