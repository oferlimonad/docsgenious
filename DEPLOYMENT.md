# 🚀 Deployment Guide - DocsGenius

This guide will help you deploy DocsGenius to Vercel with Supabase integration.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: For version control

## 🗄️ Step 1: Set Up Supabase

### 1.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned (takes ~2 minutes)
3. Note your project URL and anon key from **Settings → API**

### 1.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `SUPABASE_SCHEMA.sql`
3. Paste and run it in the SQL Editor
4. Verify that all tables were created:
   - `categories`
   - `subcategories`
   - `sections`
   - `sentences`
   - `sentence_parts`

### 1.3 Enable Email Authentication

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure email templates if needed (optional)

## 🔧 Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Configure Environment Variables

1. Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Replace the values with your actual Supabase credentials:
   - `VITE_SUPABASE_URL`: Found in Supabase → Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY`: Found in Supabase → Settings → API → anon/public key

### 2.3 Run Locally

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## 🌐 Step 3: Deploy to Vercel

### 3.1 Push to GitHub

1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin your-github-repo-url
git push -u origin main
```

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 3.3 Add Environment Variables in Vercel

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add the following variables:

```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

3. Make sure to add them for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save**

### 3.4 Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## ✅ Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Try to sign up with a new account
3. Create a category and verify it persists
4. Check Supabase dashboard to see the data

## 🔒 Security Notes

- The `anon` key is safe to use in client-side code (it's protected by Row Level Security)
- Never commit `.env` files to git
- The `.env.example` file is safe to commit (it contains no secrets)

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you've added the environment variables in Vercel and redeployed.

### Issue: "Error loading data"

**Solution**: 
1. Check that the database schema was run correctly
2. Verify RLS policies are enabled
3. Check browser console for specific error messages

### Issue: "Authentication not working"

**Solution**:
1. Verify Email provider is enabled in Supabase
2. Check Supabase → Authentication → Settings
3. Ensure email confirmation is configured correctly

### Issue: "Data not persisting"

**Solution**:
1. Check Supabase logs in the dashboard
2. Verify RLS policies allow the current user to access their data
3. Check browser console for errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🎉 You're Done!

Your DocsGenius app is now fully deployed and connected to Supabase. All user data will persist across sessions and devices!

