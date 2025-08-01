import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Users,
  Trophy,
  ArrowRight,
  Play,
  Code,
  Palette,
  Music,
  Brain,
  Star,
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>GameCraft Pro Ultimate - סביבת פיתוח משחקים מהפכנית</title>
        <meta name="description" content="יצרו משחקים מקצועיים ללא ידע תכנות מוקדם. AI מתקדם, עורך ויזואלי, ייצוא לכל הפלטפורמות." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Header */}
        <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold text-secondary-900">GameCraft Pro</h1>
                  <p className="text-sm text-secondary-600">Ultimate</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-secondary-700 hover:text-primary-600 transition-colors">תכונות</a>
                <a href="#demo" className="text-secondary-700 hover:text-primary-600 transition-colors">הדגמה</a>
                <a href="#pricing" className="text-secondary-700 hover:text-primary-600 transition-colors">מחירים</a>
                <a href="#contact" className="text-secondary-700 hover:text-primary-600 transition-colors">צור קשר</a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  התחברות
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  הרשמה חינם
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6">
                  יצרו משחקים
                  <span className="text-gradient block">ללא קוד</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-secondary-600 max-w-4xl mx-auto mb-8 leading-relaxed">
                  סביבת פיתוח משחקים מתקדמת עם AI חכם, עורך ויזואלי וייצוא לכל הפלטפורמות.
                  הפכו את חלום יצירת המשחקים למציאות תוך דקות ספורות.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Link to="/register" className="btn btn-primary btn-lg group">
                    התחילו ליצור עכשיו
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="btn btn-outline btn-lg group">
                    <Play className="w-5 h-5 ml-2" />
                    צפו בהדגמה
                  </button>
                </div>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50K+</div>
                  <div className="text-secondary-600">משחקים נוצרו</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">15+</div>
                  <div className="text-secondary-600">פלטפורמות</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">99%</div>
                  <div className="text-secondary-600">שביעות רצון</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">24/7</div>
                  <div className="text-secondary-600">תמיכה</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-secondary-900 mb-4">
                תכונות מתקדמות לכל יוצר
              </h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                כל מה שאתם צריכים כדי ליצור, לפרסם ולהרוויח ממשחקים מקצועיים
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="text-sm text-secondary-500 flex items-center">
                        <Star className="w-3 h-3 text-accent-500 ml-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              מוכנים להתחיל ליצור?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              הצטרפו לאלפי יוצרים שכבר יוצרים משחקים מדהימים עם GameCraft Pro
            </p>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg">
              התחילו בחינם היום
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-secondary-900 text-secondary-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold">GameCraft Pro</span>
                </div>
                <p className="text-secondary-400">
                  מהפכה בעולם פיתוח המשחקים
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">מוצר</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">תכונות</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">מחירים</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">הדגמות</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">תמיכה</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">מרכז עזרה</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">קהילה</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">צור קשר</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">חברה</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">אודות</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">קריירה</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">פרטיות</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-secondary-800 mt-8 pt-8 text-center">
              <p className="text-secondary-400">
                © 2025 GameCraft Pro Ultimate. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// Features data
const features = [
  {
    icon: Brain,
    title: 'AI מתקדם',
    description: 'בינה מלאכותית שכותבת קוד, יוצרת דמויות ומלחינה מוזיקה',
    details: [
      'מחולל קוד חכם',
      'יצירת דמויות אוטומטית',
      'הלחנה בינה מלאכותית',
      'אופטימיזציה אוטומטית'
    ]
  },
  {
    icon: Palette,
    title: 'עורך ויזואלי',
    description: 'כלי עיצוב מתקדמים עם מאגר נכסים עצום',
    details: [
      'ממשק דרג-אנד-דראפ',
      'אלפי נכסים מוכנים',
      'כלי ציור מקצועיים',
      'אפקטים ויזואליים'
    ]
  },
  {
    icon: Code,
    title: 'Sandbox מאובטח',
    description: 'הרצת קוד בטוחה עם תמיכה במספר שפות תכנות',
    details: [
      'Python, JavaScript, C#',
      'דיבוג מתקדם',
      'Hot Reload',
      'מעקב ביצועים'
    ]
  },
  {
    icon: Shield,
    title: 'הגנות משפטיות',
    description: 'בדיקות אוטומטיות לתוכן ומניעת הפרת זכויות יוצרים',
    details: [
      'סריקת תוכן אסור',
      'בדיקת פטנטים',
      'ניתוח זכויות יוצרים',
      'AI משפטי'
    ]
  },
  {
    icon: Globe,
    title: 'ייצוא רב-פלטפורמי',
    description: 'פרסמו למובייל, מחשב, קונסולות וחנויות אפליקציות',
    details: [
      'Android, iOS, Steam',
      'Nintendo Switch',
      'PWA ודפדפנים',
      'אינטגרציה אוטומטית'
    ]
  },
  {
    icon: Trophy,
    title: 'מסחר וזכויות',
    description: 'מכרו משחקים ונהלו זכויות יוצרים בצורה מאובטחת',
    details: [
      'שוק זכויות יוצרים',
      'משא ומתן אוטומטי',
      'תשלומים מאובטחים',
      'מעקב תמלוגים'
    ]
  }
];

export default HomePage;