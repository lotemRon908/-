import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Gamepad2, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  Download,
  Star,
  Play,
  Edit,
  Share
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>דשבורד - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">שלום, יוצר משחקים! 👋</h1>
          <p className="text-primary-100 mb-4">
            מוכנים ליצור את המשחק הבא שלכם? בואו נתחיל!
          </p>
          <Link to="/editor/new" className="btn bg-white text-primary-600 hover:bg-primary-50">
            <Plus className="w-4 h-4 ml-2" />
            יצירת משחק חדש
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">משחקים פעילים</p>
                <p className="text-2xl font-bold text-secondary-900">3</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-success-600">
              <TrendingUp className="w-4 h-4 ml-1" />
              +2 השבוע
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">כל הצפיות</p>
                <p className="text-2xl font-bold text-secondary-900">1,234</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-success-600">
              <TrendingUp className="w-4 h-4 ml-1" />
              +15% מהחודש שעבר
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">הורדות</p>
                <p className="text-2xl font-bold text-secondary-900">456</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-success-600">
              <TrendingUp className="w-4 h-4 ml-1" />
              +23% מהחודש שעבר
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">דירוג ממוצע</p>
                <p className="text-2xl font-bold text-secondary-900">4.8</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-success-600">
              <Star className="w-4 h-4 ml-1" />
              89 ביקורות
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Games */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">המשחקים שלי</h2>
                  <Link to="/games" className="text-primary-600 hover:text-primary-700 text-sm">
                    צפייה בכולם
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                          <img 
                            src={game.thumbnail} 
                            alt={game.title}
                            className="w-12 h-12 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <Gamepad2 className="w-8 h-8 text-primary-600 hidden" />
                        </div>
                        <div>
                          <h3 className="font-medium text-secondary-900">{game.title}</h3>
                          <p className="text-sm text-secondary-500">{game.category}</p>
                          <div className="flex items-center mt-1 text-xs text-secondary-400">
                            <Calendar className="w-3 h-3 ml-1" />
                            עודכן {game.updatedAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.status === 'published' 
                            ? 'bg-success-100 text-success-700'
                            : game.status === 'draft'
                            ? 'bg-secondary-100 text-secondary-700'
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {game.status === 'published' ? 'פורסם' : 
                           game.status === 'draft' ? 'טיוטה' : 'בפיתוח'}
                        </span>
                        <div className="flex space-x-1">
                          <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <Play className="w-4 h-4" />
                          </button>
                          <Link 
                            to={`/editor/${game.id}`}
                            className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Templates */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">תבניות פופולריות</h2>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Link
                      key={template.id}
                      to={`/editor/new?template=${template.id}`}
                      className="block p-3 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                          <template.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-secondary-900">{template.name}</h3>
                          <p className="text-xs text-secondary-500">{template.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">פעילות אחרונה</h2>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-secondary-900">{activity.message}</p>
                        <p className="text-xs text-secondary-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mock data
const recentGames = [
  {
    id: '1',
    title: 'משחק הפלטפורמר שלי',
    category: 'פלטפורמר',
    thumbnail: '/api/placeholder/64/64',
    status: 'published' as const,
    updatedAt: 'לפני יומיים'
  },
  {
    id: '2',
    title: 'פאזל קסום',
    category: 'פאזל',
    thumbnail: '/api/placeholder/64/64',
    status: 'draft' as const,
    updatedAt: 'לפני שעה'
  },
  {
    id: '3',
    title: 'הרפתקה בחלל',
    category: 'הרפתקאות',
    thumbnail: '/api/placeholder/64/64',
    status: 'development' as const,
    updatedAt: 'לפני 3 ימים'
  }
];

const templates = [
  {
    id: 'platformer',
    name: 'פלטפורמר 2D',
    description: 'משחק קפיצות קלאסי',
    icon: Gamepad2
  },
  {
    id: 'puzzle',
    name: 'פאזל',
    description: 'משחק חשיבה ופתרון בעיות',
    icon: Star
  },
  {
    id: 'rpg',
    name: 'משחק תפקידים',
    description: 'הרפתקה עם דמויות',
    icon: Users
  }
];

const activities = [
  {
    icon: Plus,
    message: 'יצרתם משחק חדש "פאזל קסום"',
    time: 'לפני שעה'
  },
  {
    icon: Download,
    message: 'המשחק "פלטפורמר שלי" הורד 50 פעמים',
    time: 'לפני 3 שעות'
  },
  {
    icon: Star,
    message: 'קיבלתם ביקורת 5 כוכבים',
    time: 'לפני יום'
  }
];

export default DashboardPage;