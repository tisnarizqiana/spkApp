import React from "react";

const SkeletonTable = () => {
  // Kita buat 5 baris dummy berkedip
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white dark:bg-darkCard rounded-4xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
      {/* Fake Header */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="space-y-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-48"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full w-32"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-full w-32"></div>
      </div>

      {/* Fake Table Body */}
      <div className="p-0">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-6 p-6 border-b border-slate-50 dark:border-slate-800/50 last:border-none">
            {/* Rank Circle */}
            <div className="shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800 h-10 w-10"></div>
            
            {/* Profile + Name */}
            <div className="flex items-center gap-4 flex-1">
                 <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-10 w-10"></div>
                 <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full w-1/4"></div>
                 </div>
            </div>

            {/* Metrics (Hidden on Mobile) */}
            <div className="hidden md:block h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full w-16"></div>
            <div className="hidden md:block h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full w-16"></div>

            {/* Score Box */}
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;