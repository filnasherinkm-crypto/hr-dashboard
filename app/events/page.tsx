'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Cake,
  Star,
  Gift,
  Sparkles,
  Edit2,
  Trash2,
  Filter,
  CalendarDays,
  List,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { SpecialEvent, EventType } from '@/lib/types';
import { getRelativeTime, formatDatePretty } from '@/lib/utils';
import { EventModal } from '@/components/EventModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';

export default function SpecialEventsPage() {
  const { events, deleteEvent, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<SpecialEvent | null>(null);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Birthday':
        return <Cake className="w-5 h-5 text-white" />;
      case 'Work Anniversary':
        return <Star className="w-5 h-5 text-white" />;
      case 'Company Holiday':
        return <Gift className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (activeTypeFilter !== 'All' && evt.type !== activeTypeFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesName = evt.employeeName.toLowerCase().includes(query);
        const matchesDesc = (evt.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [events, activeTypeFilter, searchTerm]);

  const handleDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      showToast('Event Removed', `${eventToDelete.title} has been deleted.`, 'info');
      setEventToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Birthday', 'Work Anniversary', 'Company Holiday', 'Personal Event'] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => setActiveTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTypeFilter === t
                    ? 'border border-[#FF7900] text-[#FF7900] bg-orange-50/40 shadow-2xs'
                    : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        {/* Search & Add */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 bg-white"
            />
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#E66C00] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Events List / Cards */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {filteredEvents.length} UPCOMING & SCHEDULED EVENTS
          </span>
          <span className="text-xs text-zinc-400">
            Calculated relative to August 11, 2026
          </span>
        </div>

        <div className="divide-y divide-zinc-100">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No events found matching current criteria.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-orange-50/20 transition-colors group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF7900] flex items-center justify-center text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
                    {getEventIcon(evt.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#FF7900] transition-colors">
                        {evt.title}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF7900] border border-orange-200/60">
                        {evt.type}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mt-1">
                      {formatDatePretty(evt.date)}{' '}
                      {evt.description && `— ${evt.description}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-16 sm:pl-0">
                  <span className="text-xs font-bold text-zinc-700 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                    {getRelativeTime(evt.date)}
                  </span>

                  {currentUser.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingEvent(evt);
                          setIsEventModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEventToDelete(evt)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        eventToEdit={editingEvent}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!eventToDelete}
        title="Delete Special Event?"
        description={`Are you sure you want to remove "${eventToDelete?.title}" from company special events?`}
        confirmLabel="Delete Event"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}
