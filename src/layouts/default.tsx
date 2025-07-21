import { useState, KeyboardEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

import { navItems } from '@/constants';

/** Accent color used for active bar + brand border */
const ACCENT = 'border-primary-400';
const ACCENT_BG = 'bg-primary-50';
const ACCENT_TEXT = 'text-primary-500';
const BRAND_NAME = 'Kiran Fashion';

/** Accessible overlay close handler */
function Overlay({ onClose }: { onClose: () => void }) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose();
    }
  };

  return (
    <div
      aria-label="Close menu overlay"
      className="absolute inset-0 bg-black/40"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={handleKey}
    />
  );
}

export default function DefaultLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = navItems.find((n) => n.path === location.pathname)?.path ?? '/';

  const activeLabel = navItems.find((n) => n.path === activePath)?.label ?? 'Dashboard';

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  /** NavItem button */
  const NavBtn = ({
    label,
    path,
    Icon,
    isMobile = false,
  }: {
    label: string;
    path: string;
    Icon: any;
    isMobile?: boolean;
  }) => {
    const active = path === activePath;

    return (
      <button
        className={clsx(
          'cursor-pointer relative w-full text-left px-4 py-2 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          'flex items-center gap-2', // Align icon & text
          active
            ? `${ACCENT_BG} ${ACCENT_TEXT} font-medium shadow-sm`
            : 'hover:bg-gray-100 text-gray-900'
        )}
        type="button"
        onClick={() => go(path)}
      >
        {active && (
          <span
            className={clsx(
              'absolute left-0 top-0 bottom-0 w-1 rounded-r',
              'bg-primary cursor-pointer'
            )}
          />
        )}
        <Icon className="w-5 h-5" />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md rounded-r-b-2xl p-4 border border-primary-100">
        {/* Brand */}
        <div className="mb-6">
          <span
            className={clsx(
              'inline-block px-4 py-2 text-lg font-bold rounded-lg border w-full text-center capitalize',
              ACCENT_TEXT,
              ACCENT
            )}
          >
            {BRAND_NAME}
          </span>
        </div>
        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((n) => (
            <NavBtn key={n.path} Icon={n.icon} label={n.label} path={n.path} />
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Drawer + Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <Overlay onClose={() => setMobileOpen(false)} />
            <motion.aside
              animate={{ x: 0, opacity: 1 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 rounded-r-2xl"
              exit={{ x: '-100%', opacity: 0 }}
              initial={{ x: '-100%', opacity: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className={clsx(
                    'inline-block px-3 py-1 text-lg font-bold rounded-lg border',
                    ACCENT_TEXT,
                    ACCENT
                  )}
                >
                  {BRAND_NAME}
                </span>
                <button
                  aria-label="Close menu"
                  className="p-1 rounded-full hover:bg-gray-100"
                  type="button"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((n) => (
                  <NavBtn key={n.path} isMobile Icon={n.icon} label={n.label} path={n.path} />
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white shadow-sm">
          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-400"
            type="button"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold truncate">{activeLabel}</h1>

          {/* Avatar */}
          <Avatar
            className="cursor-pointer border-2 border-primary-400"
            name="User"
            size="sm"
            src="https://i.pravatar.cc/100?img=8"
          />
        </header>

        {/* Page Content Wrapper */}
        {/* <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main> */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
