import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { languageAtom } from "./atoms.ts";
import type { HealthResponse } from "@marble/types";

export function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useAtom(languageAtom);
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealthStatus(data))
      .catch(() => setHealthStatus(null));
  }, []);

  const handleLanguageChange = (lang: "en" | "hi") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("app.title")}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {t("language.english")}
            </button>
            <button
              onClick={() => handleLanguageChange("hi")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === "hi"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {t("language.hindi")}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("app.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t("app.subtitle")}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            🚀 {t("app.ready")}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            📡 {t("app.api")}
          </p>
        </div>
      </main>
    </div>
  );
}
