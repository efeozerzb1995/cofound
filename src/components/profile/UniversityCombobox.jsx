import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Check, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

const universities = [
  "Yeditepe Üniversitesi",
  "ODTÜ",
  "İTÜ",
  "Koç Üniversitesi",
  "Bilkent Üniversitesi",
  "Boğaziçi Üniversitesi",
  "Sabancı Üniversitesi",
  "Hacettepe Üniversitesi",
  "Ankara Üniversitesi",
  "İstanbul Üniversitesi",
  "Ege Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "Gazi Üniversitesi",
  "Marmara Üniversitesi",
  "Çukurova Üniversitesi"
];

export default function UniversityCombobox({ value, onChange }) {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredUniversities = universities.filter(uni =>
    uni.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showManualOption = searchQuery.length > 0 && 
    !universities.some(uni => uni.toLowerCase() === searchQuery.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery(value || '');
  }, [value]);

  const handleSelect = (uni) => {
    setSearchQuery(uni);
    onChange(uni);
    setIsOpen(false);
    setIsManualEntry(false);
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    onChange(searchQuery);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setIsOpen(true);
    if (isManualEntry) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Üniversite ara..."
          className="bg-slate-700/50 border-slate-600 text-white pl-10 placeholder:text-slate-500"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((uni) => (
              <button
                key={uni}
                onClick={() => handleSelect(uni)}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-slate-600 transition-colors",
                  value === uni ? "text-emerald-400" : "text-white"
                )}
              >
                {uni}
                {value === uni && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-400">
              Sonuç bulunamadı
            </div>
          )}
          
          {showManualOption && (
            <>
              <div className="border-t border-slate-600" />
              <button
                onClick={handleManualEntry}
                className="w-full px-4 py-3 text-left text-sm text-emerald-400 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Listede yok: "{searchQuery}" olarak ekle
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}