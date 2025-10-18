import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { IconLayoutGrid, IconCalendar, IconBarChart2, IconX } from '../Icons';
import { vi } from '../../lang/vi';
import { Button } from '../ui/Button';

const navLinks = [
  { href: '/dashboard', label: vi.organizerDashboard.title, icon: IconLayoutGrid },
  { href: '/dashboard/events', label: 'Sự kiện', icon: IconCalendar },
  { href: '/dashboard/analytics-overview', label: 'Phân tích', icon: IconBarChart2 },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const baseLinkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-white/10";
  const activeLinkClasses = "!bg-brand-900/50 !text-white";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`
        w-64 flex-shrink-0 bg-gray-900/80 backdrop-blur-lg border-r border-white/10
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
         <div className="flex items-center justify-between p-4 border-b border-white/10 md:hidden">
            <Link to="/" className="text-xl font-extrabold text-white tracking-tighter">
                Eventify<span className="text-brand-500">AI</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="!p-1">
                <IconX size={24} />
            </Button>
        </div>

        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end={link.href === '/dashboard'}
                  onClick={() => setIsOpen(false)} // Close on navigation
                  className={({ isActive }) =>
                    `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
                  }
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};