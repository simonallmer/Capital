# 🚀 Capital - Deployment Guide

This guide will help you deploy the Capital game online so you can share it with others.

## 📋 Quick Deployment Options

### Option 1: GitHub Pages (Recommended - Free & Easy)

**Perfect for: Permanent hosting with custom domain support**

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create a new repository**
   - Click the "+" icon → "New repository"
   - Name it `capital-game` (or any name you prefer)
   - Make it **Public**
   - Don't initialize with README
   - Click "Create repository"

3. **Upload your files**
   - Click "uploading an existing file"
   - Drag and drop ALL files:
     - `index.html`
     - `styles.css`
     - `game.js`
     - `favicon.png`
     - `README.md`
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section (left sidebar)
   - Under "Source", select `main` branch
   - Click "Save"
   - Wait 1-2 minutes

5. **Access your game**
   - Your game will be live at: `https://yourusername.github.io/capital-game`
   - Share this URL with anyone!

**Custom Domain (Optional):**
- Buy a domain from Namecheap, GoDaddy, etc.
- In GitHub Pages settings, add your custom domain
- Update DNS records as instructed

---

### Option 2: Netlify (Easiest - Drag & Drop)

**Perfect for: Instant deployment in 30 seconds**

1. **Go to Netlify**
   - Visit [app.netlify.com/drop](https://app.netlify.com/drop)
   - No account needed for basic deployment!

2. **Drag & Drop**
   - Drag the entire `Capital` folder to the drop zone
   - Wait 10-20 seconds

3. **Get your URL**
   - Netlify will give you a URL like: `https://random-name-12345.netlify.app`
   - Click "Change site name" to customize it
   - Share your URL!

**Pro Features (Free Account):**
- Custom domain
- HTTPS automatically
- Continuous deployment from GitHub
- Form handling
- Analytics

---

### Option 3: Vercel (Best for Developers)

**Perfect for: Professional deployment with CI/CD**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from terminal**
   ```bash
   cd /path/to/Capital
   vercel
   ```

3. **Follow prompts**
   - Login/signup when prompted
   - Accept defaults
   - Get instant URL!

4. **Production deployment**
   ```bash
   vercel --prod
   ```

**Features:**
- Automatic HTTPS
- Global CDN
- Custom domains
- Preview deployments
- Analytics

---

### Option 4: Firebase Hosting (Google)

**Perfect for: Integration with other Firebase services**

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize project**
   ```bash
   cd /path/to/Capital
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Set public directory to `.` (current directory)
   - Configure as single-page app: **No**
   - Don't overwrite index.html

4. **Deploy**
   ```bash
   firebase deploy
   ```

5. **Access your game**
   - URL: `https://your-project-id.web.app`

---

### Option 5: Cloudflare Pages

**Perfect for: Lightning-fast global delivery**

1. **Go to Cloudflare Pages**
   - Visit [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up for free

2. **Create a project**
   - Click "Create a project"
   - Connect to GitHub (or upload directly)

3. **Configure build**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`

4. **Deploy**
   - Click "Save and Deploy"
   - Get your URL: `https://capital-game.pages.dev`

---

### Option 6: Render (Free Tier)

**Perfect for: Static sites with custom domains**

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign up for free

2. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect GitHub repo or upload

3. **Configure**
   - Build command: (leave empty)
   - Publish directory: `.`

4. **Deploy**
   - Click "Create Static Site"
   - Get URL: `https://capital-game.onrender.com`

---

## 🧪 Local Testing

Before deploying, test locally:

### Python (Built-in)
```bash
cd /path/to/Capital
python3 -m http.server 8000
```
Visit: `http://localhost:8000`

### Node.js
```bash
npx http-server
```
Visit: `http://localhost:8080`

### PHP (if installed)
```bash
php -S localhost:8000
```
Visit: `http://localhost:8000`

---

## 🔧 Troubleshooting

### Files not loading
- **Check file names**: Must be exact (case-sensitive)
- **Check file paths**: All files in same directory
- **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Game not starting
- **Open browser console**: F12 → Console tab
- **Check for errors**: Red text indicates issues
- **Verify all files uploaded**: index.html, styles.css, game.js, favicon.png

### Styling looks broken
- **Ensure styles.css is loaded**: Check Network tab in DevTools
- **Check CSS file path**: Should be `./styles.css`
- **Verify fonts loading**: Google Fonts should load from CDN

### Mobile not working
- **Test responsiveness**: Use DevTools mobile view
- **Check viewport meta tag**: Should be in `<head>`
- **Test on actual device**: Simulators may differ

---

## 📱 Mobile Optimization

The game is already responsive, but for best mobile experience:

1. **Add to Home Screen**
   - iOS: Share → Add to Home Screen
   - Android: Menu → Add to Home Screen

2. **PWA Enhancement** (Optional)
   Create `manifest.json`:
   ```json
   {
     "name": "Capital Game",
     "short_name": "Capital",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0f172a",
     "theme_color": "#6366f1",
     "icons": [
       {
         "src": "favicon.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

   Add to `index.html` `<head>`:
   ```html
   <link rel="manifest" href="manifest.json">
   ```

---

## 🌐 Custom Domain Setup

### For GitHub Pages:
1. Buy domain from registrar
2. Add CNAME record pointing to `yourusername.github.io`
3. In GitHub repo settings → Pages → Custom domain
4. Enter your domain and save

### For Netlify/Vercel:
1. Go to domain settings in dashboard
2. Add your custom domain
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

---

## 📊 Analytics (Optional)

### Google Analytics
Add before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### Plausible (Privacy-friendly)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🔒 Security Best Practices

1. **HTTPS Only**: All modern hosts provide free SSL
2. **Content Security Policy**: Add to `<head>`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline';">
   ```

3. **No sensitive data**: Game runs client-side only
4. **Regular updates**: Keep dependencies current

---

## 🎯 Performance Optimization

### Already Implemented:
- ✅ Vanilla JavaScript (no heavy frameworks)
- ✅ Minimal CSS (no Tailwind bloat)
- ✅ Font preloading
- ✅ Efficient rendering

### Additional Optimizations:
1. **Minify files** (for production):
   ```bash
   # Install terser for JS
   npm install -g terser
   terser game.js -o game.min.js -c -m
   
   # Install csso for CSS
   npm install -g csso-cli
   csso styles.css -o styles.min.css
   ```

2. **Enable compression** (automatic on most hosts)

3. **Use CDN** (automatic on Netlify, Vercel, Cloudflare)

---

## 📞 Support

If you encounter issues:

1. **Check browser console** (F12)
2. **Verify all files uploaded**
3. **Test in incognito mode**
4. **Try different browser**
5. **Check hosting platform status**

---

## 🎉 You're Ready!

Choose your preferred deployment method and get your game online in minutes!

**Recommended for beginners:** Netlify Drop (Option 2)  
**Recommended for GitHub users:** GitHub Pages (Option 1)  
**Recommended for developers:** Vercel (Option 3)

Happy deploying! 🚀
