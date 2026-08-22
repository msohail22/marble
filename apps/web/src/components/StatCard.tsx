import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}
