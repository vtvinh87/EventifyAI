
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../store/appStore';
import { 
  IconSearch, IconBell, IconLogOut, IconTicket, 
  IconBarChart2, IconPlusCircle, IconSun, IconMoon, IconMenu, IconX 
} from '../Icons';
import { vi } from '../../lang/vi';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  // FIX: Changed `logout` to `signOut` to match the method name in the auth store.
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationCount = 5; // Dữ liệu giả

  const navLinks = user?.role === 'organizer' ? [
      { to: "/dashboard", label: vi.header.dashboard, icon: IconBarChart2 },
      { to: "/create-event", label: vi.header.createEvent, icon: IconPlusCircle },
  ] : [
      { to: "/discover", label: vi.header.discover },
      { to: "/my-tickets", label: vi.header.myTickets, icon: IconTicket },
  ];

  const MobileMenu = () => (
    <div 
      className={`
        fixed inset-0 bg-gray-900 z-50 p-4 flex flex-col transition-opacity duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
            Eventify<span className="text-brand-500">AI</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)} className="!p-2">
            <IconX size={28} />
        </Button>
      </div>
      <nav className="flex flex-col gap-6">
        {user ? (
            navLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-xl font-semibold text-gray-200 hover:text-brand-400 transition-colors flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.icon && <link.icon size={20}/>} {link.label}
                </Link>
            ))
        ) : (
            <Link to="/discover" className="text-xl font-semibold text-gray-200 hover:text-brand-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {vi.header.discover}
            </Link>
        )}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-6">
          {user ? (
               <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/10 rounded-md text-xl font-semibold">
                    <IconLogOut size={20} /> {vi.header.logout}
                </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full">{vi.header.login}</Button>
            </Link>
          )}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-gray-900/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-extrabold text-white tracking-tighter flex-shrink-0">
            Eventify<span className="text-brand-500">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
              <Link to="/discover" className="text-sm font-semibold text-gray-200 hover:text-brand-400 transition-colors">
                  {vi.header.discover}
              </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder={vi.header.searchPlaceholder}
              className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-transparent rounded-lg pl-11 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative text-gray-200 hover:text-brand-400 transition-colors">
            <IconBell size={24} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-gray-900/50">
                {notificationCount}
              </span>
            )}
          </button>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full cursor-pointer" />
                <div className="absolute top-full right-0 w-56 pt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-gray-800/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl">
                    <div className="p-2 text-sm">
                      <div className="px-3 py-2">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                      </div>
                      <div className="border-t border-white/10 my-1"></div>
                      {user.role === 'organizer' ? (
                        <>
                          <Link to="/dashboard" className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-200 hover:bg-white/10 rounded-md">
                            <IconBarChart2 size={16} /> {vi.header.dashboard}
                          </Link>
                          <Link to="/create-event" className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-200 hover:bg-white/10 rounded-md">
                            <IconPlusCircle size={16} /> {vi.header.createEvent}
                          </Link>
                        </>
                      ) : (
                        <Link to="/my-tickets" className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-200 hover:bg-white/10 rounded-md">
                          <IconTicket size={16} /> {vi.header.myTickets}
                        </Link>
                      )}
                      <div className="border-t border-white/10 my-1"></div>
                      <button onClick={toggleTheme} className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 text-gray-200 hover:bg-white/10 rounded-md">
                        <span className="flex items-center gap-3">
                          {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                          {vi.header.theme}
                        </span>
                        <span className="text-xs text-gray-400">{theme === 'dark' ? vi.header.themeDark : vi.header.themeLight}</span>
                      </button>
                      <div className="border-t border-white/10 my-1"></div>
                      <button onClick={signOut} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/10 rounded-md">
                        <IconLogOut size={16} /> {vi.header.logout}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
               <Link to="/login">
                <Button variant="secondary" size="sm">{vi.header.login}</Button>
              </Link>
            )}
          </div>
           <div className="md:hidden">
              <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)} className="!p-2">
                <IconMenu size={24} />
              </Button>
           </div>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
};

export default Header;
