import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Eye, 
  Trash2, 
  FileText, 
  Lock, 
  Globe,
  Info,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CVSection({ isOwnProfile = true }) {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('user_cv_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [isPublic, setIsPublic] = useState(() => {
    const saved = localStorage.getItem('cv_visibility');
    return saved ? saved === 'public' : false;
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (cvData) {
      localStorage.setItem('user_cv_data', JSON.stringify(cvData));
    }
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('cv_visibility', isPublic ? 'public' : 'private');
  }, [isPublic]);

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const mockCV = {
        fileName: 'Deniz_Korkmaz_CV.pdf',
        fileSize: '248 KB',
        uploadDate: new Date().toISOString()
      };
      setCvData(mockCV);
      setIsUploading(false);
      toast.success('CV başarıyla yüklendi');
    }, 2000);
  };

  const handleDelete = () => {
    setCvData(null);
    localStorage.removeItem('user_cv_data');
    toast.success('CV silindi');
  };

  const handleViewCV = () => {
    toast.info('CV görüntüleniyor...');
  };

  const handleToggleVisibility = (checked) => {
    setIsPublic(checked);
    toast.success(checked ? 'CV herkese açık olarak ayarlandı' : 'CV sadece başvurduğunuz projeler için görünür');
  };

  // Render for other users viewing the profile
  if (!isOwnProfile) {
    if (!cvData) {
      return null; // Don't show anything if no CV
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-emerald-400" />
              Özgeçmiş
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPublic ? (
              <Button
                onClick={handleViewCV}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                CV İndir
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-slate-700/50 text-slate-400 cursor-not-allowed"
              >
                <Lock className="w-4 h-4 mr-2" />
                CV Gizli
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Render for profile owner
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <FileText className="w-5 h-5 text-emerald-400" />
            Özgeçmiş & Dosyalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload/Display Area */}
          {!cvData ? (
            // State A: No CV Uploaded
            <div
              onClick={handleFileUpload}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-all group"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-sm text-slate-300">Yükleniyor...</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-slate-700/50 group-hover:bg-emerald-500/10 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-white font-medium">CV Yükle (PDF)</p>
                    <p className="text-xs text-slate-400 mt-1">Tıklayarak dosya seçin</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // State B: CV Uploaded
            <div className="space-y-4">
              {/* File Card */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-500/10">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{cvData.fileName}</p>
                  <p className="text-xs text-slate-400">{cvData.fileSize}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleViewCV}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    className="border-slate-600 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="bg-slate-900/30 border border-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-white font-medium">CV Görünürlüğü</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-xs">
                          <p className="text-sm">
                            Kapalıyken CV'ni sadece senin başvuru yaptığın proje sahipleri görebilir.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={handleToggleVisibility}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {isPublic ? (
                    <>
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">Herkese Açık</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">Sadece Başvurduğum Projeler</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}