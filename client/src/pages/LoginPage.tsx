import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Gamepad2, Eye, EyeOff, Crown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, checkAdminAccess } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Check admin access if code provided
      if (adminCode) {
        checkAdminAccess(adminCode);
      }
      
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>התחברות - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900">ברוכים הבאים חזרה</h1>
            <p className="text-secondary-600 mt-2">התחברו לחשבון שלכם</p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                  כתובת דוא"ל
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="הזינו את כתובת הדוא״ל שלכם"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pr-10"
                    placeholder="הזינו את הסיסמה שלכם"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-secondary-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-secondary-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Access Code */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  className="flex items-center text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <Crown className="w-4 h-4 ml-1" />
                  {showAdminCode ? 'הסתר גישת מנהל' : 'גישת מנהל מתקדמת'}
                </button>
                
                {showAdminCode && (
                  <div className="mt-2">
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="input w-full"
                      placeholder="הזינו קוד גישת מנהל"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      קוד גישה מיוחד למנהלי המערכת
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-secondary-900">
                  זכור אותי
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  שכחתם סיסמה?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full btn-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                    מתחבר...
                  </>
                ) : (
                  'התחברות'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-secondary-600">אין לכם חשבון? </span>
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                הרשמו עכשיו
              </Link>
            </div>
          </form>

          {/* Demo Access */}
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h3 className="text-sm font-medium text-primary-800 mb-2">נסיון חינם</h3>
            <p className="text-xs text-primary-700 mb-3">
              רוצים לנסות את המערכת ללא הרשמה?
            </p>
            <button
              onClick={() => {
                setEmail('demo@gamecraft.com');
                setPassword('demo123');
              }}
              className="btn btn-outline text-primary-700 border-primary-300 hover:bg-primary-100 btn-sm w-full"
            >
              התחברות כמשתמש דמו
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;