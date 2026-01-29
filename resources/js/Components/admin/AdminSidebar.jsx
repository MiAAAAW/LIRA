import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import DynamicIcon from '@/Components/DynamicIcon';
import { ADMIN_NAVIGATION, ADMIN_CONFIG, ADMIN_ROUTES } from '@/lib/admin-constants';
import { useState } from 'react';

export default function AdminSidebar({
  isOpen = true,
  onToggle,
  className,
  isMobile = false
}) {
  const { url } = usePage();
  const [expandedGroups, setExpandedGroups] = useState(['legal', 'multimedia']);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActiveRoute = (route) => {
    if (route === '/admin') {
      return url === '/admin' || url === '/admin/';
    }
    return url.startsWith(route);
  };

  const NavItem = ({ item, isNested = false }) => {
    const active = isActiveRoute(item.route);

    return (
      <Link
        href={item.route}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          active && "bg-primary/10 text-primary font-medium",
          !active && "text-gray-600 dark:text-gray-400",
          isNested && "ml-4",
          !isOpen && !isMobile && "justify-center px-2"
        )}
      >
        <DynamicIcon
          name={item.icon}
          className={cn(
            "h-5 w-5 flex-shrink-0",
            active ? "text-primary" : "text-gray-500"
          )}
        />
        {(isOpen || isMobile) && (
          <span className="truncate">{item.label}</span>
        )}
      </Link>
    );
  };

  const NavGroup = ({ group }) => {
    const isExpanded = expandedGroups.includes(group.id);

    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleGroup(group.id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "text-gray-700 dark:text-gray-300",
            !isOpen && !isMobile && "justify-center px-2"
          )}
        >
          <DynamicIcon
            name={group.icon}
            className="h-5 w-5 flex-shrink-0 text-gray-500"
          />
          {(isOpen || isMobile) && (
            <>
              <span className="flex-1 truncate text-left font-medium">
                {group.label}
              </span>
              <DynamicIcon
                name={isExpanded ? "ChevronDown" : "ChevronRight"}
                className="h-4 w-4 text-gray-400"
              />
            </>
          )}
        </button>

        {(isOpen || isMobile) && isExpanded && (
          <div className="space-y-1 pl-2">
            {group.items.map((item) => (
              <NavItem key={item.id} item={item} isNested />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800",
        "transition-all duration-300",
        isOpen || isMobile ? "w-64" : "w-20",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4 dark:border-gray-800">
        <Link href={ADMIN_ROUTES.dashboard} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <DynamicIcon name="Music" className="h-6 w-6 text-white" />
          </div>
          {(isOpen || isMobile) && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">
                {ADMIN_CONFIG.orgName}
              </span>
              <span className="text-xs text-gray-500">{ADMIN_CONFIG.panelTitle}</span>
            </div>
          )}
        </Link>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto hidden lg:flex"
          >
            <DynamicIcon
              name={isOpen ? "PanelLeftClose" : "PanelLeft"}
              className="h-5 w-5"
            />
          </Button>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto"
          >
            <DynamicIcon name="X" className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {/* Main Items */}
          {ADMIN_NAVIGATION.main.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}

          <Separator className="my-4" />

          {/* Groups */}
          {ADMIN_NAVIGATION.groups.map((group) => (
            <NavGroup key={group.id} group={group} />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3 dark:border-gray-800">
        <nav className="space-y-1">
          {ADMIN_NAVIGATION.footer.map((item) => (
            item.external ? (
              <a
                key={item.id}
                href={item.route}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "text-gray-600 dark:text-gray-400",
                  !isOpen && !isMobile && "justify-center px-2"
                )}
              >
                <DynamicIcon name={item.icon} className="h-5 w-5 text-gray-500" />
                {(isOpen || isMobile) && <span>{item.label}</span>}
              </a>
            ) : (
              <NavItem key={item.id} item={item} />
            )
          ))}
        </nav>
      </div>
    </aside>
  );
}
