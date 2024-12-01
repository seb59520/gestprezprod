import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Settings, 
  Wrench, 
  Building2,
  LogOut,
  Menu,
  X,
  FileText,
  BookOpen,
  Bell,
  User,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import ViewToggle from './ViewToggle';
import FullscreenToggle from './FullscreenToggle';
import BannerCarousel from './BannerCarousel';
import NotificationsToggle from './NotificationsToggle';
import { Dialog, Transition } from '@headlessui/react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { currentOrganization } = useOrganization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Statistiques', href: '/statistics', icon: BarChart2 },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Paramètres', href: '/settings', icon: Settings },
    { name: 'Aide', href: '/help', icon: HelpCircle }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed header with navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        {/* Navigation */}
        <nav className="h-14"> {/* Reduced from h-16 to h-14 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {currentOrganization?.name || 'Gestion des Présentoirs'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                      location.pathname.startsWith(item.href)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                ))}

                <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <NotificationsToggle />
                  <ViewToggle />
                  <ThemeToggle />
                  <FullscreenToggle />
                </div>

                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Banner Carousel */}
        <div className="border-t border-gray-100 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1"> {/* Reduced padding */}
            <BannerCarousel />
          </div>
        </div>
      </header>

      {/* Main content with proper spacing */}
      <main className="pt-24"> {/* Reduced from pt-32 to pt-24 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Reduced padding */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;