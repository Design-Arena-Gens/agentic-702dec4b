'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NOCDashboard from '@/components/NOCDashboard';
import KPI2GDashboard from '@/components/KPI2GDashboard';
import KPI3GDashboard from '@/components/KPI3GDashboard';
import KPI4GDashboard from '@/components/KPI4GDashboard';
import AlarmManagement from '@/components/AlarmManagement';
import WorkOrderManagement from '@/components/WorkOrderManagement';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <NOCDashboard />;
      case '2g-kpi':
        return <KPI2GDashboard />;
      case '3g-kpi':
        return <KPI3GDashboard />;
      case '4g-kpi':
        return <KPI4GDashboard />;
      case 'alarms':
        return <AlarmManagement />;
      case 'work-orders':
        return <WorkOrderManagement />;
      default:
        return <NOCDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  );
}
