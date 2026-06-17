# AI CV Maker - Free ATS-Optimized Resume Generator

Transform your CV with AI-powered optimization tailored to specific job descriptions. Get ATS scores of 75%+ in seconds with zero setup required.

## ✨ Features

- **No Login Required** - Completely free, no registration or accounts
- **AI-Powered Optimization** - Uses Google Gemini to analyze job descriptions and tailor your CV
- **ATS Scoring** - Get real-time ATS compatibility scores (target: 75%+)
- **Multiple Templates** - Choose from Chronological, Functional, Hybrid, or Minimal ATS-friendly formats
- **Keyword Matching** - Automatically identifies and matches job requirements
- **Instant Download** - Download or copy optimized CV instantly
- **Privacy First** - Your data is never stored or logged

## 🎯 Target ATS Score: 75%+

Our optimizer targets an ATS score of **75% or higher**, which means:
- Your CV passes most ATS parsing systems
- Keywords match job requirements effectively
- Formatting is ATS-compliant
- Better chances of reaching human recruiters

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Server Actions
- **AI**: Google Gemini 1.5 Flash API
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Get a Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new free API key

### 2. Set Environment Variable
```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Install and Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📝 How to Use

1. **Upload Your CV** - Paste your current resume (TXT format recommended)
2. **Select Template** - Choose between 4 ATS-friendly CV formats
3. **Paste Job Description** - Copy the job posting you're applying for
4. **Click Optimize** - AI analyzes and optimizes instantly
5. **Review Results**:
   - ATS Score (0-100%)
   - Matched Keywords
   - Improvement Suggestions
6. **Download or Copy** - Get your optimized CV ready to submit

## 🎨 CV Templates (All ATS-Friendly)

### Chronological
**Best for**: Steady career progression
- Lists jobs in reverse chronological order
- Shows career progression clearly
- Most traditional ATS format

### Functional
**Best for**: Career changers, freelancers
- Focuses on skills and achievements
- Hides employment gaps
- Reorganizes experience by competencies

### Hybrid
**Best for**: Most job seekers
- Combines skills and experience
- Shows both capabilities and progression
- Most flexible format

### Minimal
**Best for**: Conservative ATS systems
- Extremely simple formatting
- Pure text, no fancy styling
- Maximum compatibility with old ATS

## 🤖 AI Optimization Process

The Gemini AI performs a 3-step optimization:

1. **Job Analysis**
   - Extracts key skills, tools, and responsibilities
   - Identifies seniority level and requirements
   - Highlights must-have qualifications

2. **CV Tailoring**
   - Rewrites sections to match job requirements
   - Adds quantifiable metrics to achievements
   - Reorganizes content by relevance
   - Uses strong action verbs
   - Keeps content truthful

3. **ATS Scoring**
   - Evaluates keyword match rate
   - Checks formatting compliance
   - Scores overall compatibility (0-100%)
   - Provides specific improvement suggestions

## 📊 Understanding Your ATS Score

- **90-100%** ✓ Excellent - Highly optimized for this job
- **75-89%** ✓ Great - Should pass most ATS systems
- **50-74%** ⚠️ Good - Could use improvements
- **Below 50%** ❌ Needs work - Major revisions suggested

## 💡 Tips for Best Results

1. **Be Specific** - Use exact job title and include full job description
2. **Use Keywords** - Original CV should include some relevant terms
3. **Numbers Matter** - Add metrics to achievements (e.g., "increased by 25%")
4. **One Job at a Time** - Optimize separately for each position
5. **Review Suggestions** - Check improvements before submitting

## 🔒 Privacy & Data

- ✓ No login or accounts required
- ✓ No data stored on servers
- ✓ No tracking or analytics
- ✓ Each session is fresh
- ✓ Your information stays with you

## 📱 Responsive Design

Works perfectly on:
- Desktop (1920px and up)
- Tablet (768px and up)
- Mobile (320px and up)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel CLI or dashboard
vercel
```

### Environment Variable
Set in Vercel dashboard:
```
GEMINI_API_KEY=your_api_key
```

### Deploy to Other Platforms

```bash
npm run build
npm start
```

## 📦 Project Structure

```
app/
  ├── page.tsx              # Main landing page
  ├── layout.tsx            # Root layout
  ├── globals.css           # Tailwind styles
  └── actions/
      └── optimize.ts       # Gemini AI optimization

components/
  ├── cv-optimizer.tsx      # Main optimizer interface
  ├── file-upload.tsx       # CV upload form
  ├── result-display.tsx    # Results & download
  ├── header.tsx            # Top navigation
  └── footer.tsx            # Footer

lib/
  └── cv-templates.ts       # 4 ATS-friendly templates
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT - Free to use and modify

## 🎯 Roadmap

- [ ] PDF upload support (currently text/paste only)
- [ ] DOCX upload support
- [ ] Multiple language support
- [ ] Save optimization history
- [ ] Compare multiple versions
- [ ] Custom template builder

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues:
1. Check if CV text is valid
2. Verify Gemini API key is correct
3. Ensure job description is complete
4. Try a different template format

---

**Made with ❤️ using Next.js 16 and Google Gemini AI**

Transform your resume. Land your dream job. 🚀
