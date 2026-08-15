'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  User,
  Shield,
  RotateCcw,
  Check,
  ChevronDown,
  Camera,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { GlobalSearchModal } from './GlobalSearchModal';
import { HRProfileModal } from './HRProfileModal';
import { useToast } from './Toast';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const pathname = usePathname();
  const { currentUser, switchRole, resetToDefault } = useHRStore();
  const { showToast } = useToast();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Page Title matching references
  const getPageTitle = () => {
    if (pathname === '/' || pathname === '/overview') return 'Overview';
    if (pathname.startsWith('/employees')) return 'Employee Details';
    if (pathname.startsWith('/headcount')) return 'Total Employees & Interns';
    if (pathname.startsWith('/calendar')) return 'Leave Calendar';
    if (pathname.startsWith('/events')) return 'Special Events';
    if (pathname.startsWith('/wfh')) return 'WFH Tracker';
    if (pathname.startsWith('/payroll')) return 'Payroll Structure';
    return 'HR Portal';
  };

  const handleRoleToggle = (role: 'admin' | 'employee') => {
    switchRole(role);
    setUserDropdownOpen(false);
    showToast(
      'Role Switched',
      role === 'admin'
        ? 'Switched to HR Admin Mode (Full Access)'
        : 'Switched to Employee Mode (Priya Nair)',
      'info'
    );
  };

  const handleResetData = () => {
    resetToDefault();
    setUserDropdownOpen(false);
    showToast('Data Reset', 'Demo records restored to original reference state', 'success');
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#050505] text-white px-6 py-4 flex items-center justify-between gap-4 border-b border-[#141414]">
        {/* Left Side: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-zinc-400 hover:text-white p-1.5 -ml-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Side: Search Bar & User / Role Dropdown */}
        <div className="flex items-center gap-3">
          {/* Functional Search Bar */}
          <div
            onClick={() => setSearchModalOpen(true)}
            className="hidden sm:flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-xl cursor-pointer w-48 md:w-64 transition-all shadow-xs hover:ring-2 hover:ring-[#FF7900]/40 group"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-500 font-normal">
              Search...
            </span>
            <kbd className="ml-auto text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              ⌘K
            </kbd>
          </div>

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="sm:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role pill indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-300 font-medium">
              {currentUser.role === 'admin' ? 'HR Admin' : 'Employee (Priya)'}
            </span>
          </div>

          {/* User Profile DP Image & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-[#FF7900] shadow-md shadow-orange-500/20 hover:scale-105 transition-all focus:outline-hidden cursor-pointer group bg-zinc-900 flex items-center justify-center text-white"
              title="HR Profile & Display Picture"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-xs">
                  {currentUser.role === 'admin' ? 'HR' : 'PN'}
                </span>
              )}
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-900" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 py-3 z-50 animate-slide-down">
                {/* Profile Card Header */}
                <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FF7900] shadow-sm shrink-0">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FF7900] text-white flex items-center justify-center font-bold text-sm">
                        HR
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-[#FF7900] border border-orange-200">
                      <Shield className="w-3 h-3" />
                      {currentUser.role === 'admin' ? 'HR Admin' : 'Employee'}
                    </div>
                  </div>
                </div>

                {/* Edit Profile / Change DP Button */}
                <div className="px-3 py-2 border-b border-zinc-100">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-orange-50/50 hover:bg-orange-100/60 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#FF7900]" />
                    <span>Edit Profile & DP Image</span>
                  </button>
                </div>

                {/* Persona Switcher */}
                <div className="px-3 py-2">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                    Switch Persona
                  </div>

                  <button
                    onClick={() => handleRoleToggle('admin')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl hover:bg-zinc-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF7900] flex items-center justify-center font-bold text-[11px]">
                        HR
                      </div>
                      <span>HR Admin (Eleanor)</span>
                    </div>
                    {currentUser.role === 'admin' && (
                      <Check className="w-4 h-4 text-[#FF7900]" />
                    )}
                  </button>

                  <button
                    onClick={() => handleRoleToggle('employee')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl hover:bg-zinc-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">
                        PN
                      </div>
                      <span>Priya Nair (Employee)</span>
                    </div>
                    {currentUser.role === 'employee' && (
                      <Check className="w-4 h-4 text-[#FF7900]" />
                    )}
                  </button>
                </div>

                {/* Reset Data */}
                <div className="border-t border-zinc-100 pt-1 px-3">
                  <button
                    onClick={handleResetData}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Initial Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Popup */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* HR Profile & DP Customizer Modal */}
      <HRProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};
