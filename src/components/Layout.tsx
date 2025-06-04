
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  DollarSign, 
  Users, 
  Calendar, 
  Package, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  CheckSquare,
  MessageCircle,
  Menu,
  X,
  Film,
  LogOut,
  User
} from 'lucide-react';
import { authService } from '../services/authService';
import { rbacService } from '../services/rbacService';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: Home, permission: 'dashboard' as const },
    { name: 'Projects', href: '/projects', icon: FolderOpen, permission: 'projects' as const },
    { name: 'Budget', href: '/budget', icon: DollarSign, permission: 'budget' as const },
    { name: 'Cast & Crew', href: '/cast-crew', icon: Users, permission: 'castCrew' as const },
    { name: 'Schedule', href: '/schedule', icon: Calendar, permission: 'schedule' as const },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, permission: 'tasks' as const },
    { name: 'Assets', href: '/assets', icon: Package, permission: 'assets' as const },
    { name: 'Locations', href: '/locations', icon: MapPin, permission: 'locations' as const },
    { name: 'Communication', href: '/communication', icon: MessageSquare, permission: 'communication' as const },
    { name: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports' as const },
    { name: 'Feedback', href: '/feedback', icon: MessageCircle, permission: 'feedback' as const },
  ];

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter(item => 
    rbacService.hasPermission(item.permission)
  );

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MoviePro</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* Mobile User Menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-xs text-gray-500">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-4">
            <Film className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MoviePro</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* Desktop User Menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-xs text-gray-500">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <Film className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MoviePro</span>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
