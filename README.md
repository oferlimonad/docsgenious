# 📝 DocsGenius

מערכת חכמה ליצירת משפטים דינמיים - כלי מקצועי לבנייה, ניהול והעתקה מהירה של תבניות טקסט.

## ✨ תכונות

- 🎯 **בנייה דינמית** - יצירת משפטים עם שדות משתנים
- 📁 **ארגון חכם** - קטגוריות ותתי-קטגוריות
- ⚡ **העתקה מהירה** - העתקה ללוח בלחיצה אחת
- ✏️ **עריכה גמישה** - עריכה ועדכון תבניות בכל רגע
- 🔐 **אבטחה מלאה** - כל משתמש רואה רק את הנתונים שלו
- ☁️ **שמירה בענן** - כל הנתונים נשמרים ב-Supabase

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js 18+ 
- npm או yarn
- חשבון Supabase (חינמי)
- חשבון Vercel (חינמי)

### התקנה מקומית

1. שכפל את הפרויקט:
```bash
git clone your-repo-url
cd docsgenious
```

2. התקן תלויות:
```bash
npm install
```

3. צור קובץ `.env`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. הפעל את שרת הפיתוח:
```bash
npm run dev
```

5. פתח בדפדפן: `http://localhost:5173`

## 📖 הוראות פריסה

ראה את [DEPLOYMENT.md](./DEPLOYMENT.md) להוראות מפורטות לפריסה ב-Vercel.

## 🛠️ טכנולוגיות

- **React** - ספריית UI
- **Vite** - Build tool מהיר
- **Tailwind CSS** - עיצוב
- **Supabase** - Backend ו-Database
- **Vercel** - Hosting

## 📁 מבנה הפרויקט

```
docsgenious/
├── lib/
│   ├── supabase.js          # קונפיגורציה של Supabase
│   └── supabaseService.js   # פונקציות CRUD
├── docsgenuous.jsx          # הקומפוננטה הראשית
├── SUPABASE_SCHEMA.sql      # סכמת מסד הנתונים
├── vercel.json              # קונפיגורציה של Vercel
└── package.json
```

## 🔐 אבטחה

- כל הנתונים מוגנים ב-Row Level Security (RLS)
- כל משתמש יכול לגשת רק לנתונים שלו
- אימות מלא דרך Supabase Auth

## 📝 רישיון

MIT License

## 🤝 תרומה

תרומות יתקבלו בברכה! פתח issue או pull request.

---

נבנה עם ❤️ בישראל

