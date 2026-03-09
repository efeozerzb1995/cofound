import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GraduationCap, Search, Check, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

const universities = [
  "Yeditepe Üniversitesi",
  "ODTÜ",
  "İTÜ",
  "Boğaziçi Üniversitesi",
  "Koç Üniversitesi",
  "Sabancı Üniversitesi",
  "Bilkent Üniversitesi",
  "Hacettepe Üniversitesi",
  "Ankara Üniversitesi",
  "Ege Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "Galatasaray Üniversitesi",
  "Marmara Üniversitesi",
  "İstanbul Üniversitesi",
  "Diğer"
];

export default function StepAcademic({ university, department, isGraduate, onChange }) {
  const [searchQuery, setSearchQuery] = useState(university || '');
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

  const handleSelect = (uni) => {
    setSearchQuery(uni);
    onChange({ university: uni });
    setIsOpen(false);
    setIsManualEntry(false);
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    onChange({ university: searchQuery });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(true);
    if (isManualEntry) {
      onChange({ university: value });
    }
  };

  return (
    <div>
      <h3 className="text-lg text-white font-medium mb-2">
        Hangi okulda ve bölümde okuyorsun?
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Akademik bilgilerin, aynı üniversiteden veya benzer alanlardaki kişilerle eşleşmeni kolaylaştırır.
      </p>

      <div className="space-y-5">
        {/* University Combobox */}
        <div className="space-y-2">
          <Label className="text-slate-300">Üniversite</Label>
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder="Üniversite ara..."
                className="bg-slate-800/50 border-slate-700 text-white h-12 pl-10 placeholder:text-slate-500"
              />
            </div>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((uni) => (
                    <button
                      key={uni}
                      onClick={() => handleSelect(uni)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-slate-700 transition-colors",
                        university === uni ? "text-emerald-400" : "text-white"
                      )}
                    >
                      {uni}
                      {university === uni && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400">
                    Sonuç bulunamadı
                  </div>
                )}
                
                {showManualOption && (
                  <>
                    <div className="border-t border-slate-700" />
                    <button
                      onClick={handleManualEntry}
                      className="w-full px-4 py-3 text-left text-sm text-emerald-400 hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Listede yok: "{searchQuery}" olarak ekle
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label className="text-slate-300">Bölüm</Label>
          <Input
            value={department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="Örn: Genetik ve Biyomühendislik"
            className="bg-slate-800/50 border-slate-700 text-white h-12 placeholder:text-slate-500"
          />
        </div>

        {/* Graduate Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700/50">
              <GraduationCap className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-white font-medium">Mezunum</p>
              <p className="text-slate-400 text-sm">Artık öğrenci değilim</p>
            </div>
          </div>
          <Switch
            checked={isGraduate}
            onCheckedChange={(checked) => onChange({ isGraduate: checked })}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}