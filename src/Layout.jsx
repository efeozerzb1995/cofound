import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  Compass, 
  Heart, 
  User, 
  LogOut,
  Settings,
  Zap,
  MessageCircle,
  BadgeCheck,
  Bell,
  PartyPopper,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const navigation = [
  { name: 'Keşfet', href: 'Explore', icon: Compass },
  { name: 'Mesajlar', href: 'Messages', icon: MessageCircle },
  { name: 'Eşleşmeler', href: 'Matches', icon: Heart },
  { name: 'Profilim', href: 'Profile', icon: User },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'Yeni Mesaj',
      message: 'Ayşe Çelik sana bir mesaj gönderdi.',
      time: '2 dk önce',
      read: false,
      link: 'Messages'
    },
    {
      id: 2,
      type: 'application',
      title: 'Yeni Başvuru',
      message: "'Yapay Et Projesi' için yeni bir başvuru var: Mert Demir.",
      time: '1 saat önce',
      read: false,
      link: 'MyProjects'
    },
    {
      id: 3,
      type: 'system',
      title: 'Doğrulama Başarılı',
      message: 'Tebrikler! Öğrenci doğrulaması başarıyla tamamlandı. Mavi tik kazandın.',
      time: 'Dün',
      read: false,
      link: null
    }
  ]);
  const [showBellShake, setShowBellShake] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Trigger shake animation on mount
    setShowBellShake(true);
    const timer = setTimeout(() => setShowBellShake(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (page) => {
    return location.pathname === createPageUrl(page);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase oturum kapatma hatası:', error);
    }

    // Clear all auth-related data
    localStorage.removeItem('user_session');
    localStorage.removeItem('ekipbul_onboarding_complete');
    localStorage.removeItem('ekipbul_user_authenticated');
    localStorage.removeItem('ekipbul_auth_provider');
    localStorage.removeItem('userProfile');
    
    toast.success('Başarıyla çıkış yapıldı.');
    
    // Redirect to Auth page
    navigate(createPageUrl('Auth'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Tüm bildirimler okundu olarak işaretlendi');
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate if link exists
    if (notification.link) {
      navigate(createPageUrl(notification.link));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'application':
        return <Rocket className="w-4 h-4 text-emerald-400" />;
      case 'system':
        return <PartyPopper className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Explore')} className="flex items-center">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6994236ab1322fa19a6339c3/e52cd1bd1_CoFoundlogowithglowingbluetones.png"
                alt="CoFound"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              <Link
                to={createPageUrl('CreateProject')}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Zap className="w-4 h-4" />
                Proje Ekle
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Notifications - Desktop */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`relative text-slate-400 hover:text-white ${showBellShake ? 'animate-bounce' : ''}`}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-slate-800 border-slate-700 max-h-[500px] overflow-y-auto" align="end">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                      <h3 className="font-semibold text-white">Bildirimler</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllRead}
                          className="text-xs text-emerald-400 hover:text-emerald-300 h-auto p-1"
                        >
                          Tümünü Okundu İşaretle
                        </Button>
                      )}
                    </div>
                    <div className="py-2">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Bildirim yok</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`px-4 py-3 cursor-pointer focus:bg-slate-700 ${
                              !notification.read ? 'bg-slate-700/30' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex gap-3 w-full">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-white">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile Dropdown - Desktop */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border border-slate-700">
                        <AvatarImage src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" />
                        <AvatarFallback className="bg-slate-700 text-slate-300">DK</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        Deniz Korkmaz
                        {localStorage.getItem('ekipbul_user_verified') === 'true' && (
                          <BadgeCheck className="w-4 h-4 text-blue-400" />
                        )}
                      </p>
                      <p className="text-xs text-slate-400">deniz@yeditepe.edu.tr</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem 
                      className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                      onClick={() => navigate(createPageUrl('Profile'))}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                      onClick={() => navigate(createPageUrl('MyProjects'))}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Projelerim
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                      onClick={() => navigate(createPageUrl('Settings'))}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Ayarlar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem 
                      className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-slate-800 w-72">
                  <div className="flex flex-col h-full">
                    {/* Mobile Profile */}
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
                      <Avatar className="h-12 w-12 border border-slate-700">
                        <AvatarImage src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" />
                        <AvatarFallback className="bg-slate-700 text-slate-300">DK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-1">
                          Deniz Korkmaz
                          {localStorage.getItem('ekipbul_user_verified') === 'true' && (
                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                          )}
                        </p>
                        <p className="text-xs text-slate-400">Genetik Öğrencisi</p>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6 space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={createPageUrl(item.href)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      ))}
                      <Link
                        to={createPageUrl('CreateProject')}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Zap className="w-5 h-5" />
                        Proje Ekle
                      </Link>
                    </div>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t border-slate-800">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Çıkış Yap
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">
                © 2026 CoFound. Tüm hakları saklıdır.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Gizlilik</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">İletişim</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}