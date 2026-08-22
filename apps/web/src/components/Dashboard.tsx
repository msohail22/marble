import React, { useState } from "react";
import { ProxyList } from "./ProxyList.tsx";
import { NanoserviceList } from "./NanoserviceList.tsx";
import { StatCard } from "./StatCard.tsx";

type TabType = "overview" | "proxies" | "workers";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const stats = [
    { label: "Total Requests", value: "128", unit: "" },
    { label: "Cache Hit Rate", value: "0", unit: "%" },
    { label: "Nanoservice Calls", value: "0", unit: "" },
    { label: "p99 Latency", value: "0", unit: "ms" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate?.("home")}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-white text-lg group-hover:bg-orange-600 transition-colors">
                M
              </div>
              <h1 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                Marble
              </h1>
            </div>
            {onNavigate && (
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate("home")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate("account")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Account
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 border-t border-gray-700 pt-4">
            {["overview", "proxies", "workers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-orange-500 border-orange-500"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Proxies and Workers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProxyList isOverview />
              <NanoserviceList isOverview />
            </div>
          </>
        )}

        {/* Proxies Tab */}
        {activeTab === "proxies" && <ProxyList isOverview={false} />}

        {/* Workers Tab */}
        {activeTab === "workers" && <NanoserviceList isOverview={false} />}
      </main>
    </div>
  );
}
