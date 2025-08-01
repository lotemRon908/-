import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Gamepad2, 
  Palette, 
  Code, 
  Upload, 
  Store, 
  BarChart3, 
  Settings,
  Crown,
  Plus,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'דשבורד',
      path: '/dashboard',
      icon: Home,
      description: 'סקירה כללית'
    },
    {
      name: 'עורך המשחקים',
      path: '/editor',
      icon: Palette,
      description: 'יצירה ועריכה'
    },
    {
      name: 'המשחקים שלי',
      path: '/games',
      icon: Gamepad2,
      description: 'ניהול פרויקטים'
    },
    {
      name: 'קוד ותסריטים',
      path: '/scripts',
      icon: Code,
      description: 'כלי פיתוח'
    },
    {
      name: 'ייצוא ופרסום',
      path: '/export',
      icon: Upload,
      description: 'הפצה רב-פלטפורמית'
    },
    {
      name: 'שוק הנכסים',
      path: '/marketplace',
      icon: Store,
      description: 'קנייה ומכירה'
    },
    {
      name: 'אנליטיקס',
      path: '/analytics',
      icon: BarChart3,
      description: 'נתונים וביצועים'
    },
  ];

  const adminItems = [
    {
      name: 'מנהל מערכת',
      path: '/admin',
      icon: Crown,
      description: 'בקרת מערכת'
    },
    {
      name: 'ניהול משתמשים',
      path: '/admin/users',
      icon: Users,
      description: 'ניהול חשבונות'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <h1 className="text-lg font-bold text-secondary-900">GameCraft Pro</h1>
            <p className="text-xs text-secondary-600">Ultimate v10.0</p>
          </div>
        </Link>
      </div>

      {/* Quick Create */}
      <div className="p-4 border-b border-secondary-200">
        <Link
          to="/editor/new"
          className="w-full btn btn-primary btn-sm flex items-center justify-center"
        >
          <Plus className="w-4 h-4 ml-2" />
          יצירת משחק חדש
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 rounded-lg transition-colors group
                ${isActive(item.path)
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                  : 'text-secondary-700 hover:bg-secondary-100'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ml-3 ${isActive(item.path) ? 'text-primary-600' : 'text-secondary-500'}`} />
              <div className="flex-1 text-right">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-secondary-500">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mt-8 px-4">
            <div className="px-3 py-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
              ניהול מערכת
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition-colors group
                    ${isActive(item.path)
                      ? 'bg-warning-100 text-warning-700 border-r-2 border-warning-600'
                      : 'text-secondary-700 hover:bg-secondary-100'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ml-3 ${isActive(item.path) ? 'text-warning-600' : 'text-secondary-500'}`} />
                  <div className="flex-1 text-right">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-secondary-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-secondary-200">
        <div className="text-center">
          <div className="text-sm font-medium text-secondary-900">
            {user?.subscription === 'free' ? 'חינמי' : 
             user?.subscription === 'pro' ? 'Pro' : 'Enterprise'}
          </div>
          {user?.subscription === 'free' && (
            <Link 
              to="/upgrade" 
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              שדרגו לPro
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;