import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const categories = [
  { value: "Biotech / Life Sciences", label: "Biotech / Life Sciences", emoji: "🧬" },
  { value: "Health & Wellness", label: "Health & Wellness", emoji: "🏥" },
  { value: "Fintech", label: "Fintech", emoji: "💰" },
  { value: "EdTech", label: "EdTech", emoji: "📚" },
  { value: "AI / Machine Learning", label: "AI / Machine Learning", emoji: "🤖" },
  { value: "SaaS / Software", label: "SaaS / Software", emoji: "💻" },
  { value: "E-commerce / Marketplace", label: "E-commerce / Marketplace", emoji: "🛒" },
  { value: "Social / Community", label: "Social / Community", emoji: "👥" },
  { value: "Gaming / Esports", label: "Gaming / Esports", emoji: "🎮" },
  { value: "Travel & Mobility", label: "Travel & Mobility", emoji: "✈️" },
  { value: "FoodTech / Agritech", label: "FoodTech / Agritech", emoji: "🌾" },
  { value: "Energy / Cleantech", label: "Energy / Cleantech", emoji: "⚡" },
  { value: "Hardware / IoT", label: "Hardware / IoT", emoji: "🔧" },
  { value: "Fashion / Lifestyle", label: "Fashion / Lifestyle", emoji: "👗" },
  { value: "Media / Content", label: "Media / Content", emoji: "📺" },
  { value: "Blockchain / Web3", label: "Blockchain / Web3", emoji: "⛓️" },
  { value: "Legal / GovTech", label: "Legal / GovTech", emoji: "⚖️" },
  { value: "Real Estate / PropTech", label: "Real Estate / PropTech", emoji: "🏢" },
  { value: "Nonprofit / Social Impact", label: "Nonprofit / Social Impact", emoji: "🌍" },
  { value: "Other / Miscellaneous", label: "Other / Miscellaneous", emoji: "📦" },
];

export default function CategoryDialog({ open, onOpenChange, selectedCategory, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kategori Seç</DialogTitle>
          <DialogDescription className="text-slate-400">
            Projenizin hangi kategoriye ait olduğunu seçin
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                onSelect(cat.value);
                onOpenChange(false);
              }}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-emerald-500/50 hover:bg-slate-700/50 text-left",
                selectedCategory === cat.value
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-900/50"
              )}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{cat.label}</p>
              </div>
              {selectedCategory === cat.value && (
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}