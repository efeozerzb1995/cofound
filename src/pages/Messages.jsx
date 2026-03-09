import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  MoreVertical,
  MessageCircle,
  Check,
  CheckCheck,
  UserPlus,
  Plus,
  Smile
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';

function formatMessageTime(createdAt) {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

export default function Messages() {
  const location = useLocation();
  const { isLoading, user: authUser } = useRequireAuth();
  const newConversationUser = location.state?.user;

  const [activeTab, setActiveTab] = useState('people');
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const activeConversationIdRef = useRef(null);
  const maxChars = 300;

  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null;
  }, [activeConversation?.id]);

  // Load conversations: distinct partners from messages + profiles
  const loadConversations = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, is_read, created_at')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      const partnerIds = new Set();
      (messages || []).forEach((m) => {
        const other = m.sender_id === userId ? m.receiver_id : m.sender_id;
        if (other) partnerIds.add(other);
      });

      if (partnerIds.size === 0) {
        setConversations([]);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, title')
        .in('user_id', Array.from(partnerIds));

      if (profileError) throw profileError;
      const profileMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.user_id]: p }), {});

      const convMap = {};
      (messages || []).forEach((m) => {
        const other = m.sender_id === userId ? m.receiver_id : m.sender_id;
        if (other && !convMap[other]) {
          const profile = profileMap[other] || {};
          convMap[other] = {
            id: other,
            participant: {
              id: other,
              name: profile.full_name || 'Kullanıcı',
              email: '',
              avatar: '',
              title: profile.title || '',
              username: (profile.full_name || '').toLowerCase().replace(/\s+/g, '')
            },
            status: 'accepted',
            lastMessage: m.content,
            lastMessageTime: formatMessageTime(m.created_at),
            unreadCount: 0,
            messages: []
          };
        }
        if (convMap[other]) {
          const isIncoming = m.receiver_id === userId;
          if (isIncoming && !m.is_read) convMap[other].unreadCount += 1;
        }
      });

      setConversations(Object.values(convMap));
    } catch (err) {
      console.error('Conversations load error:', err);
      toast.error('Sohbetler yüklenemedi.');
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // Load messages for active conversation and mark as read
  const loadMessagesForConversation = useCallback(async (userId, partnerId, partnerName = 'Kullanıcı') => {
    if (!userId || !partnerId) return;
    setLoadingMessages(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        supabase
          .from('messages')
          .select('id, sender_id, receiver_id, content, is_read, created_at')
          .eq('sender_id', userId)
          .eq('receiver_id', partnerId)
          .order('created_at', { ascending: true }),
        supabase
          .from('messages')
          .select('id, sender_id, receiver_id, content, is_read, created_at')
          .eq('sender_id', partnerId)
          .eq('receiver_id', userId)
          .order('created_at', { ascending: true })
      ]);

      if (sentRes.error) throw sentRes.error;
      if (receivedRes.error) throw receivedRes.error;

      const merged = [...(sentRes.data || []), ...(receivedRes.data || [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      const mapped = merged.map((row) => ({
        id: row.id,
        sender: row.sender_id === userId ? 'Ben' : partnerName,
        content: row.content,
        time: formatMessageTime(row.created_at),
        isMine: row.sender_id === userId,
        read: row.is_read
      }));

      setActiveConversation((prev) => {
        if (!prev || prev.id !== partnerId) return prev;
        return { ...prev, messages: mapped };
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === partnerId ? { ...c, unreadCount: 0 } : c))
      );

      // Mark as read: messages where I am receiver and partner is sender
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', partnerId);
    } catch (err) {
      console.error('Messages load error:', err);
      toast.error('Mesajlar yüklenemedi.');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Mesajlar için oturum alınırken hata:', sessionError);
          setLoadingConversations(false);
          return;
        }
        const user = sessionData?.session?.user;
        if (!user) {
          setLoadingConversations(false);
          return;
        }
        setCurrentUserId(user.id);
        await loadConversations(user.id);
      } catch (err) {
        console.error('Mesajlar için kullanıcı yüklenemedi:', err);
        setLoadingConversations(false);
      }
    })();
  }, [loadConversations]);

  useEffect(() => {
    if (newConversationUser && currentUserId && !loadingConversations) {
      const partnerId = newConversationUser.id || newConversationUser.user_id;
      const existingConv = conversations.find((c) => c.id === partnerId);
      if (existingConv) {
        setActiveConversation(existingConv);
        loadMessagesForConversation(currentUserId, partnerId);
      } else {
        const newConv = {
          id: partnerId,
          participant: {
            id: partnerId,
            name: newConversationUser.name || newConversationUser.full_name || 'Kullanıcı',
            email: newConversationUser.email || '',
            avatar: newConversationUser.avatar || '',
            title: newConversationUser.title || '',
            username: (newConversationUser.name || newConversationUser.full_name || '')
              .toLowerCase().replace(/\s+/g, '')
          },
          status: 'pending',
          lastMessage: '',
          lastMessageTime: 'Şimdi',
          unreadCount: 0,
          messages: []
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversation(newConv);
      }
    }
  }, [newConversationUser, currentUserId, loadingConversations, conversations]);

  useEffect(() => {
    if (currentUserId && activeConversation?.id && activeConversation.messages?.length === 0 && !loadingMessages) {
      loadMessagesForConversation(currentUserId, activeConversation.id, activeConversation.participant?.name);
    }
  }, [currentUserId, activeConversation?.id, loadMessagesForConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Realtime: new messages and read receipts
  useEffect(() => {
    if (!currentUserId) return;
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new;
          if (row.sender_id !== currentUserId && row.receiver_id !== currentUserId) return;
          const partnerId = row.sender_id === currentUserId ? row.receiver_id : row.sender_id;
          const isIncoming = row.receiver_id === currentUserId;
          setActiveConversation((prev) => {
            const isForActive = prev?.id === partnerId;
            if (!isForActive || !prev) return prev;
            if (!isIncoming) return prev;
            const newMsg = {
              id: row.id,
              sender: prev.participant?.name || 'Kullanıcı',
              content: row.content,
              time: formatMessageTime(row.created_at),
              isMine: false,
              read: row.is_read
            };
            return { ...prev, messages: [...(prev.messages || []), newMsg] };
          });
          setConversations((prev) => {
            const existing = prev.find((c) => c.id === partnerId);
            const isForActive = activeConversationIdRef.current === partnerId;
            const unreadInc = row.receiver_id === currentUserId && !isForActive ? 1 : 0;
            if (!existing) {
              return [
                { id: partnerId, participant: { name: 'Kullanıcı' }, lastMessage: row.content, lastMessageTime: 'Şimdi', unreadCount: row.receiver_id === currentUserId ? 1 : 0, messages: [] },
                ...prev
              ];
            }
            return prev.map((c) =>
              c.id === partnerId
                ? { ...c, lastMessage: row.content, lastMessageTime: 'Şimdi', unreadCount: c.unreadCount + unreadInc }
                : c
            );
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new;
          if (row.receiver_id !== currentUserId) return;
          if (!row.is_read) return;
          const partnerId = row.sender_id;
          setActiveConversation((prev) => {
            if (!prev || prev.id !== partnerId) return prev;
            return {
              ...prev,
              messages: (prev.messages || []).map((m) => (m.id === row.id ? { ...m, read: true } : m))
            };
          });
          setConversations((prev) => prev.map((c) => (c.id === partnerId ? { ...c, unreadCount: Math.max(0, (c.unreadCount || 0) - 1) } : c)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeConversation?.id, activeConversation?.participant?.name]);

  const handleAcceptRequest = () => {
    const updated = conversations.map(c =>
      c.id === activeConversation.id ? { ...c, status: 'accepted' } : c
    );
    setConversations(updated);
    setActiveConversation({ ...activeConversation, status: 'accepted' });
    toast.success('Bağlantı talebi kabul edildi!');
  };

  const handleRejectRequest = () => {
    const updated = conversations.map(c =>
      c.id === activeConversation.id ? { ...c, status: 'rejected' } : c
    );
    setConversations(updated);
    setActiveConversation({ ...activeConversation, status: 'rejected' });
    toast.info('Bağlantı talebi reddedildi');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation || !currentUserId) return;
    if (activeConversation.status === 'pending' && (activeConversation.messages || []).length === 0 && messageInput.length > maxChars) {
      toast.error(`İlk mesaj ${maxChars} karakterden fazla olamaz`);
      return;
    }

    const partnerId = activeConversation.id;
    const content = messageInput.trim();
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: partnerId,
          content,
          is_read: false
        })
        .select('id, sender_id, receiver_id, content, is_read, created_at')
        .single();

      if (error) throw error;

      const newMsg = {
        id: data.id,
        sender: 'Ben',
        content: data.content,
        time: formatMessageTime(data.created_at),
        isMine: true,
        read: false
      };
      setActiveConversation((prev) => (prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : prev));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === partnerId ? { ...c, lastMessage: content, lastMessageTime: 'Şimdi' } : c
        )
      );
      setMessageInput('');
    } catch (err) {
      console.error('Send message error:', err);
      toast.error('Mesaj gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  const handleConversationClick = (conv) => {
    setActiveConversation({ ...conv, messages: conv.messages?.length ? conv.messages : [] });
    if (currentUserId && conv.id) {
      loadMessagesForConversation(currentUserId, conv.id, conv.participant?.name);
    }
    if (conv.unreadCount > 0) {
      setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)));
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateName = (name, max = 22) => name.length > max ? name.slice(0, max) + '…' : name;

  if (isLoading || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] pt-16">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0d0f14] flex overflow-hidden pt-16">

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-[#111318] border-r border-slate-800/60 flex flex-col">

        {/* Search */}
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab('teams')}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === 'teams'
                ? 'bg-slate-700 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            )}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
              activeTab === 'people'
                ? 'border-slate-600 bg-slate-700 text-white'
                : 'border-slate-700/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            )}
          >
            People
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {loadingConversations ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin mb-3" />
              <p className="text-sm">Yükleniyor...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
              <UserPlus className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Henüz bağlantınız yok</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={cn(
                  "w-full p-3 flex items-center gap-3 rounded-xl transition-all text-left group",
                  activeConversation?.id === conv.id
                    ? 'bg-slate-700/60'
                    : 'hover:bg-slate-800/40'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conv.participant.avatar} />
                    <AvatarFallback className="bg-slate-700 text-slate-300 text-sm">
                      {conv.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.status === 'pending' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-[#111318]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-white text-sm font-medium truncate">
                      {truncateName(conv.participant.name)}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {conv.lastMessage || 'Yeni talep'}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#0d0f14] min-w-0">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-[#111318]/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activeConversation.participant.avatar} />
                  <AvatarFallback className="bg-slate-700 text-slate-300">
                    {activeConversation.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {activeConversation.participant.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    @{activeConversation.participant.username} · Last seen 7 days ago
                  </p>
                </div>
              </div>
              <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Connection request banner */}
            {activeConversation.status === 'pending' && !(activeConversation.messages || [])[0]?.isMine && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Bağlantı Talebi</p>
                    <p className="text-xs text-slate-400">{activeConversation.participant.name} seninle bağlantı kurmak istiyor</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleAcceptRequest} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors">
                    Kabul Et
                  </button>
                  <button onClick={handleRejectRequest} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors">
                    Reddet
                  </button>
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
                </div>
              ) : !activeConversation.messages?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageCircle className="w-14 h-14 mb-3 opacity-30" />
                  <p className="font-medium">İlk mesajı gönder</p>
                  <p className="text-sm text-slate-600 mt-1 text-center max-w-xs">
                    {activeConversation.status === 'pending'
                      ? `Bağlantı talebi göndermek için bir mesaj yaz (max ${maxChars} karakter)`
                      : `${activeConversation.participant.name} ile mesajlaşmaya başla`}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {(activeConversation.messages || []).map((message) => {
                    if (message.type === 'system') {
                      return (
                        <div key={message.id} className="flex justify-center">
                          <span className="px-3 py-1 bg-slate-800/60 border border-slate-700/40 text-slate-400 text-xs rounded-full">
                            {message.content}
                          </span>
                        </div>
                      );
                    }
                    if (message.type === 'date') {
                      return (
                        <div key={message.id} className="flex justify-center">
                          <span className="text-slate-600 text-xs">{message.content}</span>
                        </div>
                      );
                    }
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex gap-2.5", message.isMine ? "justify-end" : "justify-start")}
                      >
                        {!message.isMine && (
                          <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
                            <AvatarImage src={activeConversation.participant.avatar} />
                            <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                              {activeConversation.participant.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn("max-w-[65%]", message.isMine ? "items-end" : "items-start", "flex flex-col gap-1")}>
                          {!message.isMine && (
                            <span className="text-xs text-slate-500 ml-1">{message.sender?.split(' ').slice(0,2).join(' ')}</span>
                          )}
                          <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                            message.isMine
                              ? "bg-indigo-600/80 text-white rounded-br-md"
                              : "bg-slate-800 text-slate-100 rounded-bl-md"
                          )}>
                            {message.content}
                          </div>
                          <div className={cn("flex items-center gap-1", message.isMine ? "justify-end" : "justify-start")}>
                            <span className="text-xs text-slate-600">{message.time}</span>
                            {message.isMine && (
                              message.read
                                ? <CheckCheck className="w-3 h-3 text-indigo-400" />
                                : <Check className="w-3 h-3 text-slate-600" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {activeConversation.status === 'rejected' ? (
              <div className="px-6 py-4 border-t border-slate-800/60">
                <p className="text-center text-red-400 text-sm">Bu bağlantı talebi reddedildi</p>
              </div>
            ) : activeConversation.status === 'pending' && (activeConversation.messages || []).length > 0 && !(activeConversation.messages || []).find(m => !m.type)?.isMine ? (
              <div className="px-6 py-4 border-t border-slate-800/60">
                <p className="text-center text-amber-400 text-sm">Bağlantı talebini kabul et veya reddet</p>
              </div>
            ) : (
              <div className="px-6 py-4 border-t border-slate-800/60">
                {activeConversation.status === 'pending' && (activeConversation.messages || []).length === 0 && (
                  <div className="text-right text-xs text-slate-500 mb-1.5">
                    {messageInput.length}/{maxChars}
                  </div>
                )}
                <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/40 rounded-2xl px-4 py-3">
                  <button className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeConversation.status === 'pending' && (activeConversation.messages || []).length === 0) {
                        if (val.length <= maxChars) setMessageInput(val);
                      } else {
                        setMessageInput(val);
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                  <button className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                      messageInput.trim()
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mb-4 mx-auto opacity-20" />
              <p className="font-medium">Bir sohbet seç</p>
              <p className="text-sm text-slate-600 mt-1">Mesajlaşmaya başlamak için sol taraftan bir kişi seç</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}