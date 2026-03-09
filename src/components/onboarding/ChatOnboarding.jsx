import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function ChatOnboarding({ open, onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    goal: '',
    skills: '',
    bio: '',
    useBio: true
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && step === 0) {
      setTimeout(() => {
        addAIMessage("CoFound'a hoş geldin! 🚀 Ben senin kişisel AI asistanınım. Harika projelere katılman için profilini birlikte oluşturacağız. Öncelikle, ismin nedir?");
        setStep(1);
      }, 500);
    }
  }, [open]);

  const addAIMessage = (text, showQuickReplies = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text, 
        quickReplies: showQuickReplies 
      }]);
    }, 1500);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputValue('');
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();
    addUserMessage(trimmedInput);

    if (step === 1) {
      // Name step
      setUserData(prev => ({ ...prev, name: trimmedInput }));
      addAIMessage(
        `Tanıştığımıza memnun oldum, ${trimmedInput}! Platformda temel hedefin nedir?`,
        ['Proje Üretmek', 'Bir Ekibe Katılmak', 'Sadece İncelemek']
      );
      setStep(2);
    } else if (step === 3) {
      // Skills step
      setUserData(prev => ({ ...prev, skills: trimmedInput }));
      handleBioGeneration(trimmedInput);
      setStep(4);
    } else if (step === 5) {
      // Custom bio
      setUserData(prev => ({ ...prev, bio: trimmedInput, useBio: false }));
      addAIMessage("Süper! Profilin hazırlandı ve seni harika projelerle eşleştirmek için sabırsızlanıyorum. Hazırsan başlayalım! 🎉");
      setStep(6);
    }
  };

  const handleQuickReply = (reply) => {
    addUserMessage(reply);

    if (step === 2) {
      // Goal step
      setUserData(prev => ({ ...prev, goal: reply }));
      addAIMessage("Harika bir hedef! Hangi konularda uzmansın veya kendini geliştiriyorsun? (Örn: Python, CRISPR, Tasarım)");
      setStep(3);
    } else if (step === 4) {
      // Bio decision
      if (reply === 'Evet, Harika!') {
        setUserData(prev => ({ ...prev, useBio: true }));
        addAIMessage("Süper! Profilin hazırlandı ve seni harika projelerle eşleştirmek için sabırsızlanıyorum. Hazırsan başlayalım! 🎉");
        setStep(6);
      } else {
        addAIMessage("Tabii ki! Kendi yazmak istediğin 'Hakkımda' yazısını gönder:");
        setStep(5);
      }
    }
  };

  const handleBioGeneration = (skills) => {
    const generatedBio = `Meraklı ve gelişime açık bir ekip arkadaşı olarak, ${skills} alanlarındaki yetkinliklerimle inovatif projelere değer katmayı hedefliyorum.`;
    setUserData(prev => ({ ...prev, bio: generatedBio }));
    
    addAIMessage(
      `Yeteneklerini not aldım. 🪄 Şimdi profilin için kısa bir 'Hakkımda' yazısı oluşturdum:\n\n*"${generatedBio}"*\n\nBunu profiline ekleyeyim mi?`,
      ['Evet, Harika!', 'Kendim Yazarım']
    );
  };

  const handleComplete = () => {
    // Save to localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('ekipbul_onboarding_complete', 'true');
    localStorage.setItem('userProfile', JSON.stringify({
      name: userData.name,
      goal: userData.goal,
      skills: userData.skills,
      bio: userData.bio
    }));

    toast.success('Profilin başarıyla oluşturuldu! 🎉');
    
    // Redirect to Explore
    navigate(createPageUrl('Explore'));
    if (onComplete) onComplete(userData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-white max-w-2xl h-[600px] p-0 gap-0 flex flex-col [&>button]:hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">CoFound AI</h2>
            <p className="text-xs text-slate-500">Profil Asistanı</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'ai' && (
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {message.quickReplies && index === messages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mt-3 ml-10"
                    >
                      {message.quickReplies.map((reply, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          variant="outline"
                          size="sm"
                          className="rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          {reply}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Completion Button */}
          {step === 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 rounded-full shadow-lg shadow-emerald-500/30"
              >
                Keşfetmeye Başla 🎉
              </Button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {step < 6 && (
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim() !== '') {
                    handleSend();
                  }
                }}
                placeholder="Buraya yazın..."
                disabled={isTyping}
                className="flex-1 bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-3 h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}