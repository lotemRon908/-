import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Gamepad2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!agreeToTerms) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the store
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 8;

  return (
    <>
      <Helmet>
        <title>הרשמה - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900">יצירת חשבון חדש</h1>
            <p className="text-secondary-600 mt-2">התחילו ליצור משחקים בחינם</p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-1">
                  שם מלא
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="הזינו את שמכם המלא"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-1">
                  שם משתמש
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="בחרו שם משתמש ייחודי"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                  כתובת דוא"ל
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    className="input w-full pr-10"
                    placeholder="בחרו סיסמה חזקה"
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
                {formData.password && (
                  <div className="mt-2 text-xs">
                    <div className={`flex items-center ${passwordValid ? 'text-success-600' : 'text-secondary-500'}`}>
                      <Check className={`w-3 h-3 ml-1 ${passwordValid ? 'text-success-600' : 'text-secondary-300'}`} />
                      לפחות 8 תווים
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                  אישור סיסמה
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input w-full pr-10"
                    placeholder="הזינו שוב את הסיסמה"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-secondary-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-secondary-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 text-xs">
                    <div className={`flex items-center ${passwordsMatch ? 'text-success-600' : 'text-error-600'}`}>
                      <Check className={`w-3 h-3 ml-1 ${passwordsMatch ? 'text-success-600' : 'text-error-300'}`} />
                      {passwordsMatch ? 'הסיסמאות תואמות' : 'הסיסמאות לא תואמות'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="mr-2 block text-sm text-secondary-900">
                אני מסכים ל
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  תנאי השימוש
                </Link>
                {' '}ו
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  מדיניות הפרטיות
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !passwordsMatch || !passwordValid || !agreeToTerms}
                className="btn btn-primary w-full btn-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                    יוצר חשבון...
                  </>
                ) : (
                  'יצירת חשבון'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-secondary-600">כבר יש לכם חשבון? </span>
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                התחברו כאן
              </Link>
            </div>
          </form>

          {/* Features */}
          <div className="mt-8 p-4 bg-accent-50 border border-accent-200 rounded-lg">
            <h3 className="text-sm font-medium text-accent-800 mb-2">מה תקבלו בחינם:</h3>
            <ul className="text-xs text-accent-700 space-y-1">
              <li className="flex items-center">
                <Check className="w-3 h-3 ml-1" />
                יצירת משחקים ללא הגבלה
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 ml-1" />
                ייצוא לרשת ואנדרואיד
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 ml-1" />
                גישה למאגר נכסים
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 ml-1" />
                תמיכה קהילתית
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;