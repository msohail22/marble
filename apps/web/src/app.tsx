import React, { useState } from "react";
import { Dashboard } from "./components/index.ts";
import { HomePage, ManageAccountPage } from "./pages/index.ts";

export type PageName = "home" | "dashboard" | "account";

export function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");

  const handleNavigate = (page: string) => {
    if (page === "home" || page === "dashboard" || page === "account") {
      setCurrentPage(page as PageName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    setCurrentPage("home");
  };

  return (
    <>
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === "account" && (
        <ManageAccountPage onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
    </>
  );
}
