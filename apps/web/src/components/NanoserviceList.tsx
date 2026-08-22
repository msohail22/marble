import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Nanoservice {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  calls: number;
  avgLatency: string;
}

interface NanoserviceListProps {
  isOverview?: boolean;
}

export function NanoserviceList({ isOverview = false }: NanoserviceListProps) {
  const [services, setServices] = useState<Nanoservice[]>([
    { id: "1", name: "image-resize", status: "running", calls: 0, avgLatency: "0ms" },
    { id: "2", name: "auth-check", status: "running", calls: 0, avgLatency: "0ms" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  const handleAddService = () => {
    if (newServiceName.trim()) {
      setServices([
        ...services,
        {
          id: String(Date.now()),
          name: newServiceName,
          status: "stopped",
          calls: 0,
          avgLatency: "0ms",
        },
      ]);
      setNewServiceName("");
      setShowModal(false);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "stopped":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
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
          <h2 className="text-lg font-semibold text-white">Nanoservices</h2>
          <p className="text-sm text-gray-400 mt-1">
            {services.length} {services.length === 1 ? "worker" : "workers"} deployed
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Deploy Service
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-700">
        {services.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No nanoservices yet. Deploy your first one!</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="px-6 py-4 hover:bg-gray-700/50 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-3 h-3 rounded-full ${getStatusDot(service.status)}`}></div>
                <div>
                  <div className="font-medium text-white">{service.name}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {service.calls} calls • {service.avgLatency} avg latency
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status}
                </span>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete service"
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Deploy New Nanoservice
            </h3>
            <input
              type="text"
              placeholder="Service name (e.g., image-resize)"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddService();
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
                onClick={handleAddService}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Deploy Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
