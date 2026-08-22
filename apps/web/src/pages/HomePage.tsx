import React from "react";
import { ArrowRight, Zap, Shield, Gauge, Cpu } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-white text-lg group-hover:bg-orange-600 transition-colors">
              M
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
              Marble
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate("account")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <div className="mb-4 sm:mb-6 inline-block">
            <span className="bg-orange-500/10 text-orange-400 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-orange-500/20">
              🚀 Welcome to Marble
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Proxy & Worker
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Management
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Deploy and manage edge proxies and nanoservices with ease. Marble
            provides a powerful platform for building scalable applications.
          </p>
          <button
            onClick={() => onNavigate("dashboard")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center gap-2 mx-auto transition-colors"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Gradient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">
          Powerful Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: Zap,
              title: "Fast Deployment",
              description: "Deploy proxies and workers in seconds",
            },
            {
              icon: Shield,
              title: "Secure",
              description: "Enterprise-grade security and encryption",
            },
            {
              icon: Gauge,
              title: "Performance",
              description: "Real-time monitoring and metrics",
            },
            {
              icon: Cpu,
              title: "Scalable",
              description: "Auto-scaling infrastructure for your needs",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-6 hover:border-orange-500/50 transition-colors"
              >
                <Icon className="text-orange-500 mb-3 sm:mb-4" size={28} />
                <h4 className="text-base sm:text-lg font-semibold text-white mb-1.5">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { number: "99.9%", label: "Uptime" },
            { number: "<10ms", label: "Latency" },
            { number: "1M+", label: "Requests/sec" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-800/40 sm:bg-transparent rounded-lg border border-gray-800 sm:border-none">
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20 rounded-lg p-6 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
            Create your account and start deploying proxies and workers today.
          </p>
          <button
            onClick={() => onNavigate("account")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onNavigate("dashboard")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onNavigate("account")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Manage Account
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-xs sm:text-sm">
            <p>&copy; 2026 Marble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
