import React from "react";

const SkeletonTable = () => {
  // Kita buat 5 baris dummy berkedip
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
      {/* Fake Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>

      {/* Fake Table Body */}
      <div className="p-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center space-x-4 mb-4 p-2">
            {/* Rank Circle */}
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              {/* Name Bar */}
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              {/* Subtitle Bar */}
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            {/* Score Box */}
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
