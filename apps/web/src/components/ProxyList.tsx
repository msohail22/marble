import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Proxy {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  requests: number;
  uptime: string;
}

interface ProxyListProps {
  isOverview?: boolean;
}

export function ProxyList({ isOverview = false }: ProxyListProps) {
  const [proxies, setProxies] = useState<Proxy[]>([
    { id: "1", name: "edge-proxy-1", status: "active", requests: 64, uptime: "99.9%" },
    { id: "2", name: "edge-proxy-2", status: "active", requests: 64, uptime: "99.8%" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProxyName, setNewProxyName] = useState("");

  const handleAddProxy = () => {
    if (newProxyName.trim()) {
      setProxies([
        ...proxies,
        {
          id: String(Date.now()),
          name: newProxyName,
          status: "inactive",
          requests: 0,
          uptime: "0%",
        },
      ]);
      setNewProxyName("");
      setShowModal(false);
    }
  };

  const handleDeleteProxy = (id: string) => {
    setProxies(proxies.filter((p) => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-750 px-6 py-4 border-b border-gray-700 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-white">Proxies</h2>
          <p className="text-sm text-gray-400 mt-1">
            {proxies.length} {proxies.length === 1 ? "proxy" : "proxies"} deployed
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Proxy
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-700">
        {proxies.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No proxies yet. Create your first one!</p>
          </div>
        ) : (
          proxies.map((proxy) => (
            <div
              key={proxy.id}
              className="px-6 py-4 hover:bg-gray-700/50 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-3 h-3 rounded-full ${getStatusDot(proxy.status)}`}></div>
                <div>
                  <div className="font-medium text-white">{proxy.name}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {proxy.requests} requests • {proxy.uptime} uptime
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                    proxy.status
                  )}`}
                >
                  {proxy.status}
                </span>
                <button
                  onClick={() => handleDeleteProxy(proxy.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete proxy"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add New Proxy</h3>
            <input
              type="text"
              placeholder="Proxy name (e.g., edge-proxy-3)"
              value={newProxyName}
              onChange={(e) => setNewProxyName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddProxy();
              }}
              autoFocus
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 mb-6 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProxy}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Create Proxy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
