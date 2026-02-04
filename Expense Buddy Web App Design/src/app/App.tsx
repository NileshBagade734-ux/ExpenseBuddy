import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Toaster } from '@/app/components/ui/sonner';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';
import { LandingPage } from '@/app/pages/LandingPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { DashboardPage } from '@/app/pages/DashboardPage';
import { AddTransactionPage } from '@/app/pages/AddTransactionPage';
import { TransactionsPage } from '@/app/pages/TransactionsPage';
import { ReportsPage } from '@/app/pages/ReportsPage';
import { BudgetsPage } from '@/app/pages/BudgetsPage';
import { GoalsPage } from '@/app/pages/GoalsPage';
import { AlertsPage } from '@/app/pages/AlertsPage';
import { CategoriesPage } from '@/app/pages/CategoriesPage';
import { ExportPage } from '@/app/pages/ExportPage';
import { SettingsPage } from '@/app/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState(user ? 'dashboard' : 'landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'add-transaction':
        return <AddTransactionPage onNavigate={setCurrentPage} />;
      case 'transactions':
        return <TransactionsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'export':
        return <ExportPage />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  // If not logged in, show auth pages
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        {renderPage()}
        <Toaster />
      </div>
    );
  }

  // If logged in, show app layout with sidebar
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>

      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
