import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle,
  ChevronDown,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חפשו משחקים, נכסים או תבניות..."
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="text-sm font-semibold text-secondary-900">התראות</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 text-center text-secondary-500">
                    אין התראות חדשות
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <Link
            to="/help"
            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-medium text-secondary-900 flex items-center">
                  {user?.fullName}
                  {user?.role === 'admin' && (
                    <Crown className="w-4 h-4 text-warning-500 mr-1" />
                  )}
                </div>
                <div className="text-xs text-secondary-500">{user?.email}</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-600" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 ml-3" />
                    פרופיל
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 ml-3" />
                    הגדרות
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Crown className="w-4 h-4 ml-3" />
                      מנהל מערכת
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                  >
                    <LogOut className="w-4 h-4 ml-3" />
                    התנתקות
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;