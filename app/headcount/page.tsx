'use client';

import React, { useState } from 'react';
import { Users, User, TrendingUp, PieChart, MapPin, Building, Briefcase } from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { StatCard } from '@/components/StatCard';

export default function HeadcountPage() {
  const { stats, employees } = useHRStore();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Group locations
  const locationCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    const loc = emp.location || 'Remote';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top 2 KPI Summary Cards (Faithful to Reference UI 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="TOTAL EMPLOYEES"
          value={stats.totalEmployees}
          subtitle="Full-time staff headcount"
          icon={<Users className="w-5 h-5 text-white" />}
        />

        <StatCard
          title="TOTAL INTERNS"
          value={stats.totalInterns}
          subtitle="Current internship cohort"
          icon={<User className="w-5 h-5 text-white" />}
        />
      </div>

      {/* Main Breakdown Card: HEADCOUNT BY DEPARTMENT (Faithful to Reference UI 3) */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            HEADCOUNT BY DEPARTMENT
          </h3>
          <span className="text-xs text-zinc-400 font-medium">
            Active organizational structure
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/30">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  EMPLOYEES
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  INTERNS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {stats.headcountByDepartment.map((row) => (
                <tr
                  key={row.department}
                  onClick={() =>
                    setSelectedDept(selectedDept === row.department ? null : row.department)
                  }
                  className={`hover:bg-orange-50/20 transition-colors cursor-pointer ${
                    selectedDept === row.department ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-xs font-bold text-zinc-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900]" />
                    <span>{row.department}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#FF7900]">
                    {row.employees}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#FF7900]">
                    {row.interns}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-900">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table TOTAL Summary Footer (Matching Reference UI 3) */}
            <tfoot>
              <tr className="bg-zinc-50/60 border-t-2 border-zinc-200">
                <td className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  TOTAL
                </td>
                <td className="px-6 py-4 text-xs font-bold text-[#FF7900]">
                  {stats.totalHeadcountSummary.employees}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-[#FF7900]">
                  {stats.totalHeadcountSummary.interns}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-zinc-900">
                  {stats.totalHeadcountSummary.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Headcount Visual Analytics & Location Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Share Visualizer */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#FF7900]" />
                Department Distribution
              </h4>
              <span className="text-xs text-zinc-400">Total: {employees.length}</span>
            </div>

            <div className="mt-5 flex flex-col gap-3.5">
              {stats.headcountByDepartment.map((dept) => {
                const percentage =
                  employees.length > 0
                    ? Math.round((dept.total / employees.length) * 100)
                    : 0;
                return (
                  <div key={dept.department} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">{dept.department}</span>
                      <span className="font-medium text-zinc-500">
                        {dept.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FF7900] to-[#E65100] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF7900]" />
                Headcount by Office Location
              </h4>
              <span className="text-xs text-zinc-400">Hubs & Remote</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {Object.entries(locationCounts).map(([loc, count]) => (
                <div
                  key={loc}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-800">{loc}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Primary Office</p>
                  </div>
                  <span className="text-lg font-bold text-[#FF7900] bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-zinc-100">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
