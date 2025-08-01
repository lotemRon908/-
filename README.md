# 🎮 GameCraft Pro Ultimate

**סביבת פיתוח משחקים מהפכנית שמאפשרת לכל אחד ליצור משחקים מקצועיים ללא ידע תכנות מוקדם**

![GameCraft Pro Ultimate](https://img.shields.io/badge/Version-10.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 🌟 תכונות עיקריות

### 🤖 מערכת AI מתקדמת
- **מחולל קוד חכם**: כותב קוד מלא רק מתיאור טקסט
- **יוצר דמויות**: מייצר דמויות באיכות מקצועית
- **מעצב סביבות**: יוצר רקעים ועולמות משחק
- **מלחין מוזיקה**: יוצר פסקולים וצלילים
- **כותב דיאלוגים**: יוצר שיחות ועלילות
- **אופטימיזציה אוטומטית**: משפר ביצועים אוטומטית

### 🎨 מערכת גרפיקה מתקדמת
- **עורך ויזואלי**: כלי עיצוב דרג-אנד-דראפ
- **מאגרי נכסים עצומים**: אלפי דמויות, רקעים ואפקטים
- **מברשות מתקדמות**: כלי ציור ועיצוב מקצועיים
- **אפקטים ויזואליים**: תאורה, צללים, חלקיקים
- **אנימציות**: מערכת אנימציה מתקדמת
- **מערכת שכבות**: עבודה עם שכבות מרובות

### 💻 מערכת הרצת קוד מתקדמת
- **Sandbox מאובטח**: הרצה בטוחה של קוד
- **תמיכה במספר שפות**: Python, JavaScript, C#, Lua
- **מערכת Debug**: כלי דיבאג מתקדמים
- **מוניטור ביצועים**: מעקב אחר זיכרון ומעבד
- **Hot Reload**: שינויים בזמן אמת
- **מערכת שגיאות**: זיהוי ותיקון אוטומטי

### 🛡️ הגנות משפטיות מתקדמות
- **סורק תוכן אסור**: מונע תוכן פוגעני/לא חוקי
- **בודק פטנטים**: וידוא אי-הפרת פטנטים
- **מנתח זכויות יוצרים**: מונע גניבת קניין רוחני
- **ווליד סימני מסחר**: בדיקת סימני מסחר
- **מאכף רישיונות**: ניהול רישיונות אוטומטי
- **AI משפטי**: בדיקה אוטומטית של כל התוכן

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js 18+ 
- npm 9+
- MongoDB 7+
- Redis 7+ (אופציונלי)
- Docker & Docker Compose (אופציונלי)

### התקנה מקומית

1. **שכפול הפרויקט**
```bash
git clone https://github.com/yourusername/gamecraft-pro-ultimate.git
cd gamecraft-pro-ultimate
```

2. **התקנת תלויות**
```bash
npm run install:all
```

3. **הגדרת משתני סביבה**
```bash
# השרת
cp server/.env.example server/.env
# ערוך את הקובץ server/.env עם הערכים שלך

# הקליינט
cp client/.env.example client/.env
# ערוך את הקובץ client/.env עם הערכים שלך
```

4. **הפעלת MongoDB**
```bash
# עם Docker
docker run -d -p 27017:27017 --name gamecraft-mongo mongo:7.0

# או עם התקנה מקומית
mongod
```

5. **הפעלת האפליקציה**
```bash
npm run dev
```

האפליקציה תהיה זמינה ב:
- 🌐 Frontend: http://localhost:3000
- 🖥️ Backend: http://localhost:5000
- 📊 API Docs: http://localhost:5000/api-docs

### התקנה עם Docker

```bash
# הפעלת כל השירותים
docker-compose up -d

# צפייה בלוגים
docker-compose logs -f

# עצירת השירותים
docker-compose down
```

## 📁 מבנה הפרויקט

```
gamecraft-pro-ultimate/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # קומפוננטות React
│   │   ├── pages/         # עמודים
│   │   ├── store/         # Redux Store
│   │   ├── services/      # API Services
│   │   ├── hooks/         # Custom Hooks
│   │   ├── utils/         # Utilities
│   │   └── types/         # TypeScript Types
│   ├── public/            # קבצים סטטיים
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Controllers
│   │   ├── models/        # MongoDB Models
│   │   ├── routes/        # API Routes
│   │   ├── middleware/    # Middleware
│   │   ├── services/      # Business Logic
│   │   └── utils/         # Utilities
│   └── package.json
├── shared/                # קוד משותף
│   └── types/            # TypeScript Types
├── docs/                  # תיעוד
├── scripts/              # סקריפטים
├── docker-compose.yml    # Docker Compose
└── README.md
```

## 🎯 יעדי המשתמשים

### 👶 למתחילים
- ללמוד לפתח משחקים ללא ידע תכנות
- ליצור משחקים פשוטים בדקות ספורות
- להבין את עקרונות פיתוח המשחקים

### 🎓 לחובבים
- ליצור משחקים מקצועיים לחברים ומשפחה
- להתנסות בסגנונות ואלמנטים שונים
- לפרסם משחקים בחנויות האפליקציות

### 💼 למקצוענים
- לפתח משחקים מסחריים במהירות
- להרוויח כסף ממכירת זכויות יוצרים
- לנהל צוות פיתוח ופרויקטים מרובים

### 🏢 לחברות
- לפתח משחקים ברמה תעשייתית
- לנהל פורטפוליו משחקים
- להפיץ בכל הפלטפורמות בו-זמנית

## 🎮 סוגי משחקים שניתן ליצור

### 📱 משחקי מובייל
- משחקים קזואליים
- פאזלים
- משחקי פעולה
- משחקי RPG

### 💻 משחקי מחשב
- משחקי אסטרטגיה
- משחקי הרפתקאות
- משחקי סימולציה
- משחקי מרוצים

### 🎮 משחקי קונסולה
- Nintendo Switch
- PlayStation
- Xbox
- Steam Deck

### 🌐 משחקי ווב
- משחקי HTML5
- Progressive Web Apps
- משחקי דפדפן
- משחקי ענן

## 🔧 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
PUT  /api/auth/change-password
```

### Project Endpoints

```typescript
GET    /api/projects          # קבלת כל הפרויקטים
POST   /api/projects          # יצירת פרויקט חדש
GET    /api/projects/:id      # קבלת פרויקט ספציפי
PUT    /api/projects/:id      # עדכון פרויקט
DELETE /api/projects/:id      # מחיקת פרויקט
```

### AI Endpoints

```typescript
POST /api/ai/generate-code    # יצירת קוד
POST /api/ai/generate-assets  # יצירת נכסים
POST /api/ai/optimize        # אופטימיזציה
POST /api/ai/analyze         # ניתוח קוד
```

## 👨‍💻 מערכת מנהל (קוד: lotemronkaplan21)

המערכת כוללת פאנל מנהל מתקדם עם הפיצ'רים הבאים:

- **עריכת קוד בסיסי**: גישה מלאה לקוד האפליקציה
- **ניהול משתמשים**: בקרה מלאה על המשתמשים
- **מערכת analytics**: נתונים מפורטים על השימוש
- **בקרת תוכן**: מודרציה ובקרה על התוכן
- **הגדרות מערכת**: שליטה בכל פרמטרי המערכת

### גישה לפאנל המנהל

1. הוסף header `Admin-Access-Code: lotemronkaplan21` לבקשות API
2. או השתמש בקוד הגישה בממשק המשתמש
3. גש ל `/admin` לפאנל המנהל המלא

## 🔒 אבטחה

### הגנות משפטיות
- בדיקת תוכן אוטומטית
- מניעת פיראטיות
- ציות לחוקים
- ביטוח משפטי

### ביטחון טכני
- הצפנת נתונים
- גיבויים אוטומטיים
- הגנה מפני וירוסים
- בקרת גישה

## 🚀 Deployment

### Production Build

```bash
# Build all
npm run build

# Start production server
npm start
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

קובץ `.env` לייצור:

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-very-secure-secret
CLIENT_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-key
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# E2E tests
npm run test:e2e
```

## 📊 Monitoring

המערכת כוללת מוניטורינג מתקדם:

- **Application Performance Monitoring (APM)**
- **Error Tracking עם Sentry**
- **Real-time Analytics**
- **Health Checks**
- **Custom Metrics**

## 🤝 Contributing

אנחנו מזמינים תרומות! בדוק את [CONTRIBUTING.md](CONTRIBUTING.md) להנחיות.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** עבור ה-API של GPT
- **MongoDB** עבור מסד הנתונים
- **React** עבור ה-Frontend Framework
- **Express.js** עבור ה-Backend Framework
- **Material-UI** עבור קומפוננטות UI

## 📞 תמיכה וקשר

- 📧 Email: support@gamecraft-pro.com
- 💬 Discord: [GameCraft Community](https://discord.gg/gamecraft)
- 📚 Documentation: [docs.gamecraft-pro.com](https://docs.gamecraft-pro.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/yourusername/gamecraft-pro-ultimate/issues)

---

**🎮 GameCraft Pro Ultimate - מביא את עתיד פיתוח המשחקים אליך!**