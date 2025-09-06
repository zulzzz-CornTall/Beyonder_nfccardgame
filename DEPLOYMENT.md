# Deployment Guide for NFC Fighter

This project includes configurations for multiple deployment platforms. Choose the one that best fits your needs:

## 🚀 Quick Deploy Options

### 1. **Vercel (Recommended for Full-Stack)**
Vercel provides excellent support for full-stack applications with automatic deployments.

**Setup:**
1. Fork/upload your repository to GitHub
2. Connect your GitHub account to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically on every push to main/master

**Required Secrets:**
- `VERCEL_TOKEN` (in GitHub repository secrets)
- `VERCEL_ORG_ID` (in GitHub repository secrets)
- `VERCEL_PROJECT_ID` (in GitHub repository secrets)

### 2. **Railway (Great for Full-Stack with Database)**
Railway provides built-in PostgreSQL and easy deployment.

**Setup:**
1. Connect your GitHub repository to [Railway](https://railway.app)
2. Add your environment variables
3. Railway will automatically deploy on pushes

**Required Secrets:**
- `RAILWAY_TOKEN` (in GitHub repository secrets)
- `RAILWAY_PROJECT_ID` (in GitHub repository secrets)

### 3. **GitHub Pages (Frontend Only)**
Free static hosting directly from your GitHub repository.

**Setup:**
1. Go to your repository Settings > Pages
2. Source: "Deploy from a branch" or "GitHub Actions"
3. If using actions, the workflow is already configured
4. Enable GitHub Pages in repository settings

**Note:** This only deploys the frontend. Backend functionality won't work.

### 4. **Netlify (Full-Stack with Serverless Functions)**
Netlify can handle both static frontend and serverless backend functions.

**Setup:**
1. Connect your repository to [Netlify](https://netlify.com)
2. Netlify will use the `netlify.toml` configuration automatically
3. Add environment variables in Netlify dashboard

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random string for session encryption
- `NODE_ENV` - Set to "production" for production deployments

## 📝 Deployment Steps

1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Choose your platform and follow the setup above**

3. **Configure environment variables on your chosen platform**

4. **Your app will be automatically deployed!**

## 🛠️ Build Commands

- `npm run build` - Build both frontend and backend
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

## 🔍 Troubleshooting

**Build Fails:**
- Check that all environment variables are set
- Ensure Node.js version is 18 or higher
- Run `npm run check` locally to catch TypeScript errors

**Runtime Errors:**
- Verify DATABASE_URL is accessible from your deployment platform
- Check that all required environment variables are set
- Review deployment logs for specific error messages

## 📊 Platform Comparison

| Platform | Cost | Full-Stack | Database | Auto-Deploy | Best For |
|----------|------|------------|----------|-------------|----------|
| Vercel | Free tier + paid | ✅ | External only | ✅ | Modern web apps |
| Railway | Free tier + paid | ✅ | Built-in PostgreSQL | ✅ | Full-stack with DB |
| GitHub Pages | Free | ❌ Frontend only | ❌ | ✅ | Static sites, demos |
| Netlify | Free tier + paid | ✅ Serverless | External only | ✅ | JAMstack apps |

Choose based on your needs:
- **For full game functionality**: Use Vercel or Railway
- **For demo/portfolio**: GitHub Pages works great
- **For JAMstack approach**: Netlify with serverless functions