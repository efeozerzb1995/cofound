import React from 'react';
import { Lightbulb, Code, HelpCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const options = [
  {
    id: 'entrepreneur',
    icon: Lightbulb,
    title: 'Girişimci',
    description: 'Bir fikrim var, ekip arıyorum.'
  },
  {
    id: 'talent',
    icon: Code,
    title: 'Yetenek',
    description: 'Bir projeye dahil olmak istiyorum.'
  },
  {
    id: 'explorer',
    icon: HelpCircle,
    title: 'Meraklı',
    description: 'Henüz emin değilim, sadece bakınıyorum.'
  }
];

export default function StepBasics({ value, onChange }) {
  return (
    <div>
      <h3 className="text-lg text-white font-medium mb-2">
        Hangisi seni daha iyi tanımlıyor?
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Bu bilgi, sana en uygun projeleri ve ekip arkadaşlarını önermemize yardımcı olacak.
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4",
              value === option.id
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            )}
          >
            <div className={cn(
              "p-3 rounded-lg",
              value === option.id ? "bg-emerald-500/20" : "bg-slate-700/50"
            )}>
              <option.icon className={cn(
                "w-6 h-6",
                value === option.id ? "text-emerald-400" : "text-slate-400"
              )} />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold",
                value === option.id ? "text-emerald-400" : "text-white"
              )}>
                {option.title}
              </h4>
              <p className="text-slate-400 text-sm mt-0.5">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}