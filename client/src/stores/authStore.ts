import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

interface AuthStore extends AuthState {
  initializeAuth: () => Promise<void>;
  checkAdminAccess: (code: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem('token');
          if (token) {
            const user = await authService.verifyToken(token);
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const { user, token } = await authService.login(email, password);
          
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true });
          
          toast.success(`ברוך הבא, ${user.fullName}!`);
        } catch (error: any) {
          toast.error(error.message || 'שגיאה בהתחברות');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData: any) => {
        try {
          set({ isLoading: true });
          const { user, token } = await authService.register(userData);
          
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true });
          
          toast.success('ההרשמה בוצעה בהצלחה!');
        } catch (error: any) {
          toast.error(error.message || 'שגיאה בהרשמה');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
        toast.success('התנתקת בהצלחה');
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser });
          toast.success('הפרופיל עודכן בהצלחה');
        } catch (error: any) {
          toast.error(error.message || 'שגיאה בעדכון הפרופיל');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAdminAccess: (code: string) => {
        // Special admin access code from the specifications
        const adminCode = 'lotemronkaplan21';
        const { user } = get();
        
        if (code === adminCode) {
          // Grant admin access
          if (user) {
            const updatedUser = { ...user, role: 'admin' as const };
            set({ user: updatedUser });
            toast.success('🔐 גישת מנהל הופעלה בהצלחה!');
            return true;
          }
        }
        
        return user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);