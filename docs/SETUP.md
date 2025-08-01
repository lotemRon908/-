# 🚀 GameCraft Pro Ultimate - Setup Guide

## מדריך התקנה מהיר

### דרישות מערכת

- **Node.js**: גרסה 16.0 או חדשה יותר
- **npm**: גרסה 8.0 או חדשה יותר  
- **MongoDB**: גרסה 4.4 או חדשה יותר
- **Git**: לשכפול הפרויקט

### התקנה מהירה

#### 1. שכפול הפרויקט
```bash
git clone <repository-url>
cd gamecraft-pro-ultimate
```

#### 2. התקנת תלויות
```bash
# התקנת תלויות לכל החלקים
npm run install-all

# או התקנה ידנית:
npm install
cd server && npm install
cd ../client && npm install
```

#### 3. הגדרת משתני סביבה

צרו קובץ `.env` בתיקיית `server/`:

```bash
cp server/.env.example server/.env
```

ערכו את הקובץ עם הערכים שלכם:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/gamecraft-pro

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here

# Admin Access
ADMIN_ACCESS_CODE=lotemronkaplan21
```

#### 4. הפעלת MongoDB

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (עם Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# או השתמשו ב-MongoDB Atlas (ענן)
```

#### 5. הרצת האפליקציה

```bash
# הרצה במצב פיתוח (Frontend + Backend)
npm run dev

# או הרצה נפרדת:
npm run server:dev  # Backend בלבד
npm run client:dev  # Frontend בלבד
```

### גישה לאפליקציה

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔐 גישת מנהל מערכת

### קוד גישה מיוחד
לקבלת הרשאות מנהל, השתמשו בקוד: `lotemronkaplan21`

### אפשרויות גישה:
1. **דרך דף ההתחברות**: לחצו על "גישת מנהל מתקדמת"
2. **דרך ה-API**: 
   ```bash
   POST /api/auth/admin-access
   {
     "accessCode": "lotemronkaplan21"
   }
   ```
3. **דרך האפליקציה**: נווטו לעמוד `/admin`

## 🗃️ מבנה הפרויקט

```
gamecraft-pro-ultimate/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # רכיבים
│   │   ├── pages/         # עמודים
│   │   ├── stores/        # Zustand stores
│   │   ├── services/      # API services  
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # עזרים
│   ├── public/            # קבצים סטטיים
│   └── package.json
├── server/                # Node.js Backend
│   ├── routes/           # נתיבי API
│   ├── models/           # מודלי MongoDB
│   ├── middleware/       # Middleware
│   ├── utils/           # עזרים
│   ├── uploads/         # קבצים מועלים
│   ├── logs/           # לוגים
│   └── package.json
├── shared/              # קוד משותף
├── docs/               # תיעוד
└── assets/            # נכסים
```

## 🧪 בדיקות

```bash
# הרצת בדיקות Backend
cd server && npm test

# הרצת בדיקות Frontend  
cd client && npm test

# הרצת כל הבדיקות
npm test
```

## 🚀 Deploy לפרודקשן

### הכנה לפרודקשן

```bash
# בניית Frontend
npm run build

# הגדרת משתני סביבה לפרודקשן
export NODE_ENV=production
export MONGODB_URI=mongodb://your-production-db
export JWT_SECRET=your-production-secret
```

### Deploy Options

1. **Heroku**
2. **Vercel** (Frontend)
3. **Railway**
4. **Digital Ocean**
5. **AWS/GCP/Azure**

## 🔧 פתרון בעיות

### בעיות נפוצות

#### 1. שגיאת חיבור למסד נתונים
```bash
# בדקו שMongoDB רץ
mongo --eval "db.stats()"

# או
mongosh --eval "db.stats()"
```

#### 2. שגיאות התקנת תלויות
```bash
# נקו cache
npm cache clean --force

# מחקו node_modules והתקינו מחדש
rm -rf node_modules package-lock.json
npm install
```

#### 3. שגיאות CORS
וודאו ש-`CLIENT_URL` בקובץ `.env` נכון

#### 4. בעיות אימות
וודאו ש-`JWT_SECRET` מוגדר ולא ריק

### לוגים ודיבוג

```bash
# צפייה בלוגים בזמן אמת
tail -f server/logs/combined.log

# לוגי שגיאות
tail -f server/logs/error.log
```

## 📚 משאבים נוספים

- [תיעוד API](./API.md)
- [מדריך פיתוח](./DEVELOPMENT.md)
- [אבטחה ובטיחות](./SECURITY.md)
- [תרומה לפרויקט](./CONTRIBUTING.md)

## 🆘 תמיכה

- **GitHub Issues**: [דווח על באג](https://github.com/lotemRon908/-/issues)
- **דוא"ל**: support@gamecraft-pro.com
- **Discord**: [שרת הקהילה](https://discord.gg/gamecraft-pro)

---

**🎮 GameCraft Pro Ultimate - המק מן את חלום יצירת המשחקים למציאות!**