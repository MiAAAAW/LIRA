import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import DynamicIcon from '@/Components/DynamicIcon';
import { ModeToggle } from '@/Components/ui/mode-toggle';
import { ADMIN_CONFIG, ADMIN_ROUTES } from '@/lib/admin-constants';

export default function AdminHeader({
  title,
  breadcrumbs = [],
  user,
  onMenuClick,
  sidebarOpen
}) {
  const handleLogout = () => {
    router.post(ADMIN_ROUTES.logout);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:border-gray-800">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <DynamicIcon name="Menu" className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href={ADMIN_ROUTES.dashboard}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <DynamicIcon name="Home" className="h-4 w-4" />
          </Link>

          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <DynamicIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Title - Desktop */}
        {title && (
          <h1 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white ml-4">
            {title}
          </h1>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-2 border-l dark:border-gray-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || ADMIN_CONFIG.defaultEmail}
              </p>
            </div>

            <div className="relative group">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all dark:bg-gray-900 dark:border-gray-800">
                <Link
                  href={ADMIN_ROUTES.profile}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <DynamicIcon name="User" className="h-4 w-4" />
                  Mi Perfil
                </Link>
                <Link
                  href={ADMIN_ROUTES.settings}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <DynamicIcon name="Settings" className="h-4 w-4" />
                  Configuración
                </Link>
                <div className="my-1 border-t dark:border-gray-800" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <DynamicIcon name="LogOut" className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title - Mobile */}
      {title && (
        <div className="md:hidden px-4 pb-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      )}
    </header>
  );
}
