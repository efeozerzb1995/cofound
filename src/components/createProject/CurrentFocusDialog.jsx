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

const focuses = [
  { 
    value: "Fikir Doğrulama", 
    label: "Fikir Doğrulama",
    description: "Konsept testi ve pazar araştırması"
  },
  { 
    value: "MVP Geliştirme", 
    label: "MVP Geliştirme",
    description: "Minimum uygulanabilir ürün oluşturma"
  },
  { 
    value: "Kurucu Ortak Bulma", 
    label: "Kurucu Ortak Bulma",
    description: "Ekip tamamlama ve ortak arayışı"
  },
  { 
    value: "İlk Kullanıcı Edinimi", 
    label: "İlk Kullanıcı Edinimi",
    description: "Early adopter bulma ve onboarding"
  },
  { 
    value: "Yatırım Hazırlığı", 
    label: "Yatırım Hazırlığı",
    description: "Pitch deck ve yatırımcı görüşmeleri"
  },
  { 
    value: "Gelir Modeli Testi", 
    label: "Gelir Modeli Testi",
    description: "Monetization ve fiyatlandırma stratejisi"
  },
  { 
    value: "Ürün Geliştirme", 
    label: "Ürün Geliştirme",
    description: "Özellik geliştirme ve iyileştirme"
  },
];

export default function CurrentFocusDialog({ open, onOpenChange, selectedFocus, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Şu Anki Öncelik</DialogTitle>
          <DialogDescription className="text-slate-400">
            En çok odaklandığınız alanı seçin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {focuses.map((focus) => (
            <button
              key={focus.value}
              onClick={() => {
                onSelect(focus.value);
                onOpenChange(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:border-emerald-500/50 hover:bg-slate-700/50 text-left",
                selectedFocus === focus.value
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-900/50"
              )}
            >
              <div className="flex-1">
                <p className="text-base font-medium text-white mb-1">{focus.label}</p>
                <p className="text-xs text-slate-400">{focus.description}</p>
              </div>
              {selectedFocus === focus.value && (
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}