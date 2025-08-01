import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Crown, Users, Settings, BarChart3, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const AdminPage: React.FC = () => {
  const { user, checkAdminAccess } = useAuthStore();
  const [adminCode, setAdminCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(user?.role !== 'admin');

  const handleAdminAccess = () => {
    if (checkAdminAccess(adminCode)) {
      setShowCodeInput(false);
    }
  };

  if (showCodeInput) {
    return (
      <>
        <Helmet>
          <title>גישת מנהל - GameCraft Pro Ultimate</title>
        </Helmet>

        <div className="max-w-md mx-auto mt-20">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-warning-600" />
            </div>
            <h1 className="text-xl font-bold text-secondary-900 mb-2">גישת מנהל מערכת</h1>
            <p className="text-secondary-600 mb-6">הזינו את קוד הגישה המתקדם</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="קוד גישה מיוחד"
                className="input w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
              />
              <button
                onClick={handleAdminAccess}
                className="btn btn-primary w-full"
              >
                אמת גישה
              </button>
            </div>
            
            <p className="text-xs text-secondary-500 mt-4">
              רק מנהלי מערכת מורשים יכולים לגשת לאזור זה
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>מנהל מערכת - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-warning-600 to-error-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Crown className="w-6 h-6 ml-2" />
            מנהל מערכת
          </h1>
          <p className="text-warning-100">ברוכים הבאים לפאנל הניהול המתקדם</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">משתמשים פעילים</p>
                <p className="text-2xl font-bold text-secondary-900">1,234</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">משחקים יוצרו היום</p>
                <p className="text-2xl font-bold text-secondary-900">89</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">בדיקות ביטחון</p>
                <p className="text-2xl font-bold text-secondary-900">456</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">תקריות ביטחון</p>
                <p className="text-2xl font-bold text-secondary-900">0</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">כלי ניהול</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <button className="w-full btn btn-outline text-right justify-start">
                  <Users className="w-4 h-4 ml-3" />
                  ניהול משתמשים
                </button>
                <button className="w-full btn btn-outline text-right justify-start">
                  <Settings className="w-4 h-4 ml-3" />
                  הגדרות מערכת
                </button>
                <button className="w-full btn btn-outline text-right justify-start">
                  <Shield className="w-4 h-4 ml-3" />
                  בקרת תוכן
                </button>
                <button className="w-full btn btn-outline text-right justify-start">
                  <BarChart3 className="w-4 h-4 ml-3" />
                  דוחות מתקדמים
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">פעילות אחרונה</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="text-sm text-secondary-600">
                  משתמש חדש נרשם - לפני 5 דקות
                </div>
                <div className="text-sm text-secondary-600">
                  משחק חדש פורסם - לפני 12 דקות
                </div>
                <div className="text-sm text-secondary-600">
                  בדיקת ביטחון הושלמה - לפני 30 דקות
                </div>
                <div className="text-sm text-secondary-600">
                  עדכון מערכת הותקן - לפני שעה
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-error-600 ml-2" />
            <h3 className="text-sm font-medium text-error-800">הודעת ביטחון</h3>
          </div>
          <p className="text-sm text-error-700 mt-1">
            אזור זה מיועד רק למנהלי מערכת מורשים. כל הפעולות מתועדות ונמצאות במעקב.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminPage;