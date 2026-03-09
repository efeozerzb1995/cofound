import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ComboInput from './ComboInput';
import ProductStageDialog from './ProductStageDialog';
import CurrentFocusDialog from './CurrentFocusDialog';

export default function StepDetails({ data, onChange }) {
  const [tagInput, setTagInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedWhatLookingFor, setSelectedWhatLookingFor] = useState([]);
  const [showProductStageDialog, setShowProductStageDialog] = useState(false);
  const [showCurrentFocusDialog, setShowCurrentFocusDialog] = useState(false);

  const handleAIEnhance = async () => {
    if (!data.description || data.description.length < 10) {
      toast.error('Açıklama çok kısa! AI için daha fazla detay ekleyin.');
      return;
    }

    setIsEnhancing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const enhanced = `${data.description}\n\n**Proje Hedefleri:**\nBu projede, modern teknolojileri kullanarak sektördeki mevcut sorunlara yenilikçi çözümler sunmayı hedefliyoruz. Projemiz, sürdürülebilir ve ölçeklenebilir bir yaklaşımla gerçek dünya problemlerine değer katmayı amaçlamaktadır.\n\n**Beklenen Çıktılar:**\nProje sonunda, alanında öncü bir ürün/sistem geliştirerek hem akademik katkı sağlamayı hem de ticari potansiyel yaratmayı planlıyoruz.`;
    
    onChange({ description: enhanced });
    setIsEnhancing(false);
    toast.success('Açıklama AI ile geliştirildi! ✨');
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      onChange({ tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    onChange({ tags: data.tags.filter(t => t !== tag) });
  };

  const toggleWhatLookingFor = (item) => {
    const current = data.whatLookingFor || [];
    if (current.includes(item)) {
      onChange({ whatLookingFor: current.filter(i => i !== item) });
    } else {
      onChange({ whatLookingFor: [...current, item] });
    }
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
      {/* 1. Problem */}
      <div className="space-y-2">
        <Label htmlFor="problem" className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
          Çözdüğünüz temel problem nedir? <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="problem"
          value={data.problem || ''}
          onChange={(e) => onChange({ problem: e.target.value })}
          placeholder="Hangi problemi çözüyorsunuz?"
          maxLength={500}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
        />
        <p className="text-xs text-slate-500">{(data.problem || '').length}/500 karakter</p>
      </div>

      {/* 2. Solution */}
      <div className="space-y-2">
        <Label htmlFor="solution" className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          Bu problemi nasıl çözüyorsunuz? <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="solution"
          value={data.solution || ''}
          onChange={(e) => onChange({ solution: e.target.value })}
          placeholder="Net değer öneriniz..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
        />
      </div>

      {/* 3. Target Audience */}
      <div className="space-y-2">
        <Label className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          Ana hedef kitleniz kim? <span className="text-red-400">*</span>
        </Label>
        <ComboInput
          value={data.targetAudience || ''}
          onChange={(value) => onChange({ targetAudience: value })}
          options={[
            'B2C (Tüketici odaklı)',
            'B2B (Şirket odaklı)',
            'Marketplace',
            'Community platform'
          ]}
          placeholder="Seçin veya yazın (Örn: 15-35 yaş arası sporcular)"
        />
      </div>

      {/* 4. Product Status */}
      <div className="space-y-2">
        <Label className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">4</span>
          Ürün şu anda hangi aşamada? <span className="text-red-400">*</span>
        </Label>
        <Button
          type="button"
          onClick={() => setShowProductStageDialog(true)}
          variant="outline"
          className="w-full justify-between bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
        >
          {data.productStatus || "Ürün aşaması seçin"}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>

      <ProductStageDialog
        open={showProductStageDialog}
        onOpenChange={setShowProductStageDialog}
        selectedStage={data.productStatus}
        onSelect={(val) => onChange({ productStatus: val })}
      />

      {/* 5. Current Focus */}
      <div className="space-y-2">
        <Label className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
          Şu anki önceliğiniz nedir? <span className="text-red-400">*</span>
        </Label>
        <Button
          type="button"
          onClick={() => setShowCurrentFocusDialog(true)}
          variant="outline"
          className="w-full justify-between bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
        >
          {data.currentFocus || "Öncelik seçin"}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>

      <CurrentFocusDialog
        open={showCurrentFocusDialog}
        onOpenChange={setShowCurrentFocusDialog}
        selectedFocus={data.currentFocus}
        onSelect={(val) => onChange({ currentFocus: val })}
      />

      {/* 6. What Makes You Different */}
      <div className="space-y-2">
        <Label htmlFor="different" className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">6</span>
          Sizi farklı kılan nedir? <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="different"
          value={data.whatMakesYouDifferent || ''}
          onChange={(e) => onChange({ whatMakesYouDifferent: e.target.value })}
          placeholder="2-3 cümle ile farkınızı anlatın..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
        />
      </div>

      {/* 7. What Are You Looking For */}
      <div className="space-y-2">
        <Label className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">7</span>
          Platformda ne arıyorsunuz? <span className="text-red-400">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {['Technical co-founder', 'Developer', 'Designer', 'Growth partner', 'Strategic advisor'].map((item) => (
            <Button
              key={item}
              type="button"
              variant={(data.whatLookingFor || []).includes(item) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleWhatLookingFor(item)}
              className={(data.whatLookingFor || []).includes(item) 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* 8. Links */}
      <div className="space-y-3">
        <Label className="text-slate-300 flex items-center gap-2">
          <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">8</span>
          Projenizi nereden görebiliriz?
        </Label>
        <div className="space-y-2">
          <Input
            placeholder="Website (zorunlu)"
            value={data.website || ''}
            onChange={(e) => onChange({ website: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Input
            placeholder="App Store (opsiyonel)"
            value={data.appStore || ''}
            onChange={(e) => onChange({ appStore: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Input
            placeholder="Google Play (opsiyonel)"
            value={data.googlePlay || ''}
            onChange={(e) => onChange({ googlePlay: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Old Description Field - Optional */}
      <div className="space-y-2 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-slate-300">
            Ek Notlar (Opsiyonel)
          </Label>
          <Button
            type="button"
            size="sm"
            onClick={handleAIEnhance}
            disabled={isEnhancing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isEnhancing ? 'Geliştiriliyor...' : 'AI ile Geliştir'}
          </Button>
        </div>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Eklemek istediğiniz başka detaylar..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-slate-300">
          Etiketler
        </Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Örn: CRISPR, React, Drone"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Button 
            type="button" 
            onClick={addTag}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Ekle
          </Button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.tags.map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-slate-700 text-slate-200 hover:bg-slate-600 pr-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}