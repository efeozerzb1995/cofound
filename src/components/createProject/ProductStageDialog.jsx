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

const stages = [
  { 
    value: "Fikir Aşaması", 
    label: "Fikir Aşaması",
    description: "Konsept geliştirme ve araştırma aşaması"
  },
  { 
    value: "Tohum Öncesi", 
    label: "Tohum Öncesi",
    description: "İlk prototip ve pilot çalışmalar"
  },
  { 
    value: "Minimum Uygulanabilir Ürün (MVP)", 
    label: "Minimum Uygulanabilir Ürün (MVP)",
    description: "Temel özelliklerle çalışan versiyon"
  },
  { 
    value: "Tohum Aşaması", 
    label: "Tohum Aşaması",
    description: "İlk kullanıcılar ve geri bildirimler"
  },
  { 
    value: "Ürün-Pazar Uyumu", 
    label: "Ürün-Pazar Uyumu",
    description: "Doğrulanmış talep ve büyüme potansiyeli"
  },
  { 
    value: "Ölçeklenme", 
    label: "Ölçeklenme",
    description: "Hızlı büyüme ve genişleme dönemi"
  },
];

export default function ProductStageDialog({ open, onOpenChange, selectedStage, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ürün Aşaması Seç</DialogTitle>
          <DialogDescription className="text-slate-400">
            Projenizin şu anki aşamasını seçin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {stages.map((stage) => (
            <button
              key={stage.value}
              onClick={() => {
                onSelect(stage.value);
                onOpenChange(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:border-emerald-500/50 hover:bg-slate-700/50 text-left",
                selectedStage === stage.value
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-900/50"
              )}
            >
              <div className="flex-1">
                <p className="text-base font-medium text-white mb-1">{stage.label}</p>
                <p className="text-xs text-slate-400">{stage.description}</p>
              </div>
              {selectedStage === stage.value && (
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}