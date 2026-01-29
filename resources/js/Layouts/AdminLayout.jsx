import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/admin/AdminSidebar';
import AdminHeader from '@/Components/admin/AdminHeader';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children, title, breadcrumbs = [] }) {
  const { auth } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex fixed inset-y-0 left-0 z-40"
      />

      {/* Sidebar Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        isMobile
      />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        {/* Header */}
        <AdminHeader
          title={title}
          breadcrumbs={breadcrumbs}
          user={auth?.user}
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
