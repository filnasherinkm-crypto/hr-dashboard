'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Camera,
  Briefcase,
  Building,
  Phone,
  MapPin,
  Shield,
  Check,
  Sparkles,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { useToast } from './Toast';

interface HRProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    id: 'av-1',
    label: 'Corporate Woman',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
  },
  {
    id: 'av-2',
    label: 'Executive Woman',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop',
  },
  {
    id: 'av-3',
    label: 'Corporate Man',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  },
  {
    id: 'av-4',
    label: 'Executive Man',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
  },
  {
    id: 'av-5',
    label: 'Professional Lead',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop',
  },
];

export const HRProfileModal: React.FC<HRProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useHRStore();
  const { showToast } = useToast();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [title, setTitle] = useState(currentUser.title || 'Human Resources Director');
  const [department, setDepartment] = useState(currentUser.department || 'People & Operations');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0].url);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 880-9900');
  const [mounted, setMounted] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setTitle(currentUser.title || 'Human Resources Director');
      setDepartment(currentUser.department || 'People & Operations');
      setAvatarUrl(currentUser.avatarUrl || PRESET_AVATARS[0].url);
      setPhone(currentUser.phone || '+1 (555) 880-9900');
    }
  }, [isOpen, currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.email = email;
    currentUser.title = title;
    currentUser.department = department;
    currentUser.avatarUrl = avatarUrl;
    currentUser.phone = phone;

    showToast('Profile Updated', 'HR Admin display picture and details saved.', 'success');
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-slide-down"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF7900] flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">HR Profile & Display Picture</h2>
              <p className="text-xs text-zinc-400">Manage administrator persona and avatar photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            {/* Avatar Preview & Preset Selection */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70">
            {/* DP Image */}
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF7900] shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-zinc-900">{name}</h3>
              <p className="text-xs text-[#FF7900] font-semibold">{title}</p>
              <p className="text-[11px] text-zinc-500">{department}</p>

              {/* Preset Selector */}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarUrl(av.url)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === av.url ? 'border-[#FF7900] scale-110 shadow-xs' : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                    title={av.label}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Avatar Image URL Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Custom Display Picture (Image URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or direct image URL"
                className="w-full px-3 py-2 text-xs border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrlInput.trim()) {
                    setAvatarUrl(customUrlInput.trim());
                    setCustomUrlInput('');
                  }
                }}
                className="px-3 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shrink-0 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Profile Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>
          </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-[#FF7900] hover:bg-[#E66C00] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
