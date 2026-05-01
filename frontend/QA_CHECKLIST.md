# 🎯 Final Quality Assurance Checklist
## Farmer's Platform - Pre-Publication

---

## 📱 1. Responsive Layout Verification

### Desktop (1920px+)
- [ ] Dashboard displays all widgets properly
- [ ] Navigation bar shows all items without overflow
- [ ] Charts render at optimal size
- [ ] Images scale correctly
- [ ] Forms have appropriate width constraints
- [ ] Modals/dialogs centered properly
- [ ] Footer elements aligned

### Laptop (1366px - 1920px)
- [ ] Layout adapts smoothly
- [ ] No horizontal scrolling
- [ ] Cards maintain proper spacing
- [ ] Sidebar (if any) doesn't overlap content

### Tablet (768px - 1024px)
- [ ] Navigation collapses to hamburger menu
- [ ] Grid layouts stack appropriately (3→2 columns)
- [ ] Touch targets minimum 44x44px
- [ ] Charts remain readable
- [ ] Forms stack vertically
- [ ] Bottom navigation appears (if implemented)

### Mobile (320px - 767px)
- [ ] All content visible without horizontal scroll
- [ ] Bottom navigation works correctly
- [ ] Hamburger menu opens/closes smoothly
- [ ] Cards stack to single column
- [ ] Images resize/crop appropriately
- [ ] Text remains readable (min 16px)
- [ ] Buttons easily tappable
- [ ] Modals fit screen with padding

### Specific Component Tests
- [ ] **District Search**: Dropdown doesn't overflow on mobile
- [ ] **Price Charts**: Responsive container works on all screens
- [ ] **Weather Cards**: Stack properly on mobile
- [ ] **AI Chat**: Input bar always visible at bottom
- [ ] **Image Upload**: Camera works on mobile devices
- [ ] **Tables**: Scroll horizontally on small screens

### Testing Commands
```bash
# Use browser DevTools
# Chrome: F12 → Device Toolbar (Ctrl+Shift+M)
# Test these resolutions:
# - 375x667 (iPhone SE)
# - 390x844 (iPhone 12/13)
# - 360x740 (Samsung Galaxy)
# - 768x1024 (iPad)
# - 1920x1080 (Desktop)
```

---

## ♿ 2. Accessibility Compliance

### Color Contrast (WCAG AA)
- [ ] Text color on white: Minimum 4.5:1 ratio
  - Test: Primary text (#0f172a on #ffffff)
  - Test: Secondary text (#64748b on #ffffff)
- [ ] Button text contrast: 4.5:1 minimum
  - Test: White text on green-600 (#16a34a)
- [ ] Link colors distinguishable: 3:1 minimum
- [ ] Error messages readable: Red-600 (#dc2626) on white

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Keyboard Navigation
- [ ] All interactive elements focusable with Tab
- [ ] Focus indicator clearly visible
- [ ] Logical tab order (top→bottom, left→right)
- [ ] Escape key closes modals/dialogs
- [ ] Enter key activates buttons
- [ ] Arrow keys navigate dropdown menus
- [ ] No keyboard traps (can escape all elements)

### ARIA Labels & Roles
- [ ] Images have alt text: `<img alt="Rice crop in field">`
- [ ] Buttons have descriptive labels
- [ ] Form inputs have associated labels
- [ ] Navigation has `role="navigation"`
- [ ] Main content has `role="main"`
- [ ] Charts have `aria-label` descriptions
- [ ] Loading states have `aria-live="polite"`
- [ ] Error messages have `role="alert"`

### Screen Reader Testing
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Test complete user journey:
  - Login/signup
  - Dashboard navigation
  - Search district
  - View crop prices
  - AI chat interaction
- [ ] All content announced correctly
- [ ] No unlabeled interactive elements
- [ ] Proper heading hierarchy (H1→H2→H3)

### Form Accessibility
- [ ] All inputs have `<label>` elements
- [ ] Required fields marked: `aria-required="true"`
- [ ] Error messages linked: `aria-describedby="error-id"`
- [ ] Autocomplete attributes added
- [ ] Placeholder text not only indicator

### Accessibility Checklist
```tsx
// Good ✅
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<img src="/crop.jpg" alt="Rice crop ready for harvest" />

<input 
  id="district" 
  aria-label="Select district"
  aria-describedby="district-help"
/>

// Bad ❌
<button><X /></button> // No label
<img src="/crop.jpg" /> // No alt
<input placeholder="District" /> // Placeholder only
```

---

## 🌐 3. Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome (latest)** - Primary target
  - All features work
  - Charts render correctly
  - Animations smooth
- [ ] **Firefox (latest)**
  - Form submissions work
  - CSS Grid layouts correct
  - Web Speech API (if used)
- [ ] **Edge (latest)**
  - Microsoft services compatible
  - PWA install works
- [ ] **Safari (latest)** - Mac only
  - Webkit-specific CSS works
  - Date/time inputs render
  - Flexbox/Grid layouts

### Mobile Browsers
- [ ] **Chrome Mobile (Android)**
  - Touch gestures work
  - Camera access functional
  - Voice input works
- [ ] **Safari Mobile (iOS)**
  - iOS-specific bugs fixed
  - Touch events correct
  - No rubber-band scrolling issues
- [ ] **Samsung Internet (Android)**
  - All features functional
  - PWA install works

### Browser-Specific Issues to Check
- [ ] CSS Grid support (IE11 needs fallback)
- [ ] Flexbox gap property (older browsers)
- [ ] CSS variables (IE11 needs fallback)
- [ ] Sticky positioning
- [ ] Backdrop-filter (Safari)
- [ ] Web Speech API availability
- [ ] Intersection Observer (polyfill if needed)

### Testing Tools
```bash
# BrowserStack (free trial)
https://www.browserstack.com/

# LambdaTest (free tier)
https://www.lambdatest.com/

# Manual testing browsers:
# - Chrome DevTools device emulation
# - Firefox Responsive Design Mode
# - Safari Developer Tools
```

---

## ⚡ 4. Performance Metrics (Lighthouse)

### Run Lighthouse Audit

**Chrome DevTools:**
1. Open DevTools (F12)
2. Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Generate report

### Performance Targets
- [ ] **Performance Score: 90+**
  - First Contentful Paint (FCP): < 1.8s
  - Largest Contentful Paint (LCP): < 2.5s
  - Total Blocking Time (TBT): < 200ms
  - Cumulative Layout Shift (CLS): < 0.1
  - Speed Index: < 3.4s

### Optimization Checklist
- [ ] Images optimized (WebP format, lazy loading)
- [ ] JavaScript code-split (vendor, features)
- [ ] CSS minified and purged
- [ ] Fonts preloaded
- [ ] Third-party scripts deferred
- [ ] No console.log in production
- [ ] Compression enabled (Gzip/Brotli)

### Accessibility Targets
- [ ] **Accessibility Score: 95+**
  - All images have alt text
  - Color contrast passes
  - ARIA labels present
  - Proper heading order
  - No accessibility violations

### Best Practices Targets
- [ ] **Best Practices Score: 90+**
  - HTTPS enabled
  - No browser errors
  - Valid HTML
  - Proper meta tags
  - Secure dependencies

### SEO Targets
- [ ] **SEO Score: 90+**
  - Meta description present
  - Title tags descriptive
  - Viewport meta tag
  - Canonical URLs
  - Structured data (optional)

### Web Vitals Commands
```bash
# Install web-vitals
npm install web-vitals

# Add to main.tsx
import { reportWebVitals } from './utils/performance';
reportWebVitals(console.log);

# Run Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

### Performance Budget
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // 1MB max per chunk
  }
});
```

---

## ✅ 5. Content Accuracy & Translation

### English Content
- [ ] No typos or grammatical errors
- [ ] Consistent terminology throughout
- [ ] All labels and buttons have text
- [ ] Error messages clear and helpful
- [ ] Help text informative

### Kannada Translation (ಕನ್ನಡ)
- [ ] All UI elements translated
- [ ] Fonts support Kannada characters
- [ ] Text direction correct (LTR)
- [ ] No mixed encoding issues
- [ ] Translations culturally appropriate

### Content Review Areas
- [ ] **Navigation Labels**
  - Dashboard → ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
  - Market Prices → ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು
  - Weather → ಹವಾಮಾನ
  - Community → ಸಮುದಾಯ

- [ ] **Button Text**
  - Submit → ಸಲ್ಲಿಸು
  - Cancel → ರದ್ದುಮಾಡಿ
  - Search → ಹುಡುಕಿ
  - Save → ಉಳಿಸು

- [ ] **Error Messages**
  - "Field required" → "ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ"
  - "Invalid input" → "ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್"

- [ ] **District Names**
  - All 32 Karnataka districts spelled correctly
  - Both English and Kannada names present

- [ ] **Crop Names**
  - Rice → ಅಕ್ಕಿ
  - Wheat → ಗೋಧಿ
  - Cotton → ಹತ್ತಿ
  - Sugarcane → ಕಬ್ಬು

### Data Accuracy
- [ ] District coordinates correct
- [ ] Crop recommendations match soil types
- [ ] Weather data realistic
- [ ] Price data formatted correctly (₹ symbol)
- [ ] Government scheme links working
- [ ] Scheme names official and correct

### Translation Testing
```bash
# Test language toggle
# 1. Switch to Kannada
# 2. Verify all UI updates
# 3. Check for garbled characters
# 4. Ensure layout doesn't break
# 5. Test form submissions in both languages
```

---

## 📦 6. Deployment Packaging

### Pre-Deployment Checklist

#### Environment Variables
- [ ] Create `.env.production` file
- [ ] All API keys secured (not in code)
- [ ] Supabase credentials correct
- [ ] OpenAI API key valid
- [ ] No `.env` files in git

```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-key
```

#### Build Configuration
- [ ] Update `package.json` version
- [ ] Set production API URLs
- [ ] Configure base URL if needed
- [ ] Enable compression plugins

```json
// package.json
{
  "name": "agri-compass",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

#### Code Quality
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] Run linter: `npm run lint`
- [ ] Fix all errors and warnings
- [ ] Remove all `console.log` statements
- [ ] Remove commented-out code
- [ ] Remove unused imports

```bash
# Pre-build checks
npm run typecheck
npm run lint
npm run build
```

#### Asset Optimization
- [ ] Compress images (use TinyPNG, Squoosh)
- [ ] Generate WebP versions
- [ ] Optimize SVG files
- [ ] Minify CSV files if large
- [ ] Generate PWA icons (all sizes)

#### Security Audit
- [ ] Run `npm audit`
- [ ] Fix critical vulnerabilities
- [ ] Update dependencies: `npm update`
- [ ] Check for exposed secrets
- [ ] Enable HTTPS only

```bash
npm audit
npm audit fix
```

---

### Build & Test Production

#### 1. Build Project
```bash
# Clean build
rm -rf dist
npm run build

# Verify build output
ls -lh dist/
# Should see: index.html, assets/, icons/, etc.
```

#### 2. Test Production Build Locally
```bash
npm run preview
# Opens at http://localhost:4173

# Test checklist:
# - All pages load
# - Images display
# - Charts render
# - Forms submit
# - PWA installable
# - Offline mode works
```

#### 3. Analyze Bundle Size
```bash
# Install analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

# Build and view report
npm run build
# Opens stats.html in browser
```

---

### Deployment Options

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configure:
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: dist
# - Install Command: npm install
```

**Environment Variables in Vercel:**
1. Go to Project Settings
2. Environment Variables
3. Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Or use drag-and-drop:
# 1. Build: npm run build
# 2. Go to https://app.netlify.com/drop
# 3. Drag dist/ folder
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Update vite.config.ts
export default defineConfig({
  base: '/agri_compass_v2/',
})

# Deploy
npm run deploy
```

#### Option 4: Custom Server (VPS)

```bash
# Build locally
npm run build

# Upload dist/ to server
scp -r dist/* user@server:/var/www/html/

# Or use rsync
rsync -avz dist/ user@server:/var/www/html/
```

**Nginx Configuration:**
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Enable gzip
  gzip on;
  gzip_types text/css application/javascript image/svg+xml;
}
```

---

### Post-Deployment Verification

#### Domain & SSL
- [ ] Custom domain configured
- [ ] HTTPS/SSL certificate active
- [ ] WWW redirect works (or non-WWW)
- [ ] Favicon displays correctly

#### Functionality Tests
- [ ] Homepage loads < 3 seconds
- [ ] All routes accessible
- [ ] Authentication works (signup/login)
- [ ] Database queries successful
- [ ] AI features functional
- [ ] Image uploads work
- [ ] PWA installable

#### Mobile Testing
- [ ] Test on real Android device
- [ ] Test on real iPhone
- [ ] PWA install prompt appears
- [ ] Offline mode works
- [ ] Camera access works
- [ ] Touch gestures smooth

#### Monitoring Setup
- [ ] Google Analytics installed (optional)
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring

```html
<!-- Add to index.html for Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📋 Final Go-Live Checklist

### Pre-Launch (T-24 hours)
- [ ] All QA items above completed
- [ ] Stakeholders notified
- [ ] Backup plan ready
- [ ] Support team briefed
- [ ] Documentation updated

### Launch Day
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Announce launch

### Post-Launch (T+24 hours)
- [ ] Monitor user feedback
- [ ] Check analytics
- [ ] Review error reports
- [ ] Fix critical bugs immediately
- [ ] Thank users for feedback

---

## 🐛 Common Issues & Fixes

### Issue: Images not loading
**Fix:** Check paths are absolute and assets in public/

### Issue: API calls failing
**Fix:** Verify environment variables in production

### Issue: PWA not installing
**Fix:** Check manifest.json path and HTTPS enabled

### Issue: Routing 404 errors
**Fix:** Add redirect rules for SPA

### Issue: Slow load times
**Fix:** Enable compression, optimize images

---

## 📞 Support Contacts

- **Technical Issues:** [Your Email]
- **Content Issues:** [Content Team]
- **Deployment Issues:** [DevOps Team]

---

## ✅ Sign-Off

| Area | Tested By | Date | Status |
|------|-----------|------|--------|
| Responsive Design | | | ⬜ |
| Accessibility | | | ⬜ |
| Cross-Browser | | | ⬜ |
| Performance | | | ⬜ |
| Content | | | ⬜ |
| Deployment | | | ⬜ |

**Final Approval:**
- [ ] Project Manager: ________________
- [ ] Technical Lead: ________________
- [ ] QA Lead: ________________

**Launch Date:** _______________

---

**🎉 Ready for Production!**

Once all items are checked, your Farmer's Platform is ready to serve Karnataka's farmers!
