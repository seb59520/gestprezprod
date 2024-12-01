import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Building2, FileText, BookOpen, Bell, User, Wrench, Settings as SettingsIcon, Flag } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  
  const settingsItems = [
    { name: 'Général', href: '/settings/general', icon: SettingsIcon },
    { name: 'Bannières', href: '/settings/banners', icon: Flag },
    { name: 'Présentoirs', href: '/settings/stands', icon: Building2 },
    { name: 'Affiches', href: '/settings/posters', icon: FileText },
    { name: 'Publications', href: '/settings/publications', icon: BookOpen },
    { name: 'Maintenance', href: '/settings/maintenance', icon: Wrench },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
    { name: 'Profil', href: '/settings/profile', icon: User }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Paramètres
          </h1>
          
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="p-2 bg-blue-500 text-white rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;