import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from 'lucide-react';
import CategoryDialog from './CategoryDialog';

const programs = [
  { value: "TÜBİTAK Destekli Proje", label: "TÜBİTAK Destekli Proje" },
  { value: "Teknofest Projesi", label: "Teknofest Projesi" },
  { value: "KOSGEB Destekli Proje", label: "KOSGEB Destekli Proje" },
  { value: "Üniversite Araştırma Projesi", label: "Üniversite Araştırma Projesi" },
  { value: "Kuluçka Programı (Incubation)", label: "Kuluçka Programı (Incubation)" },
  { value: "Hızlandırma Programı (Accelerator)", label: "Hızlandırma Programı (Accelerator)" },
  { value: "Hackathon Projesi", label: "Hackathon Projesi" },
  { value: "Bağımsız Girişim (Startup)", label: "Bağımsız Girişim (Startup)" },
  { value: "Diğer", label: "Diğer (Belirtiniz)" }
];

export default function StepBasics({ data, onChange }) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-slate-300">
          Proje Başlığı <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Örn: Yapay Et Üretimi İçin Biyoreaktör Tasarımı"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">
          Kategori <span className="text-red-400">*</span>
        </Label>
        <Button
          type="button"
          onClick={() => setShowCategoryDialog(true)}
          variant="outline"
          className="w-full justify-between bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
        >
          {data.category || "Kategori seçin"}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>

      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        selectedCategory={data.category}
        onSelect={(val) => onChange({ category: val })}
      />

      <div className="space-y-3">
        <Label className="text-slate-300">
          Program <span className="text-red-400">*</span>
        </Label>
        <RadioGroup value={data.program} onValueChange={(val) => onChange({ program: val })}>
          <div className="grid grid-cols-1 gap-3">
            {programs.map((prog) => (
              <div key={prog.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={prog.value} 
                  id={prog.value}
                  className="border-slate-600 text-emerald-500"
                />
                <Label 
                  htmlFor={prog.value} 
                  className="text-slate-300 font-normal cursor-pointer"
                >
                  {prog.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        {data.program === "Diğer" && (
          <div className="mt-3">
            <Input
              value={data.programOther || ''}
              onChange={(e) => onChange({ programOther: e.target.value })}
              placeholder="Program adını belirtiniz..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}