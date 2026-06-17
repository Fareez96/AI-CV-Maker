# AI CV Maker - ATS-Optimized Resume Builder

An intelligent CV optimization platform powered by Google Gemini AI. Upload your CV, provide a job description, and get AI-powered optimizations with ATS (Applicant Tracking System) scoring.

## 🎯 Features

- **AI-Powered CV Optimization**: Uses Google Gemini to analyze job descriptions and tailor your CV
- **ATS Scoring**: Get a detailed ATS compatibility score (0-100%) with actionable feedback
- **Keyword Extraction**: Automatically identifies key skills and requirements from job postings
- **PDF Generation**: Download optimized CVs as professional PDFs
- **Secure Authentication**: Email/password authentication with Better Auth
- **Real-time Optimization**: Instant feedback on CV improvements and keyword matching
- **Comprehensive Error Handling**: Automatic retry with exponential backoff, graceful error recovery

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Server Actions, Better Auth
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI**: Google Gemini 1.5 Flash API
- **File Processing**: PDF parsing, DOCX extraction, text parsing
- **Error Handling**: Global error boundaries, auto-retry mechanisms, fallback UIs

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Neon PostgreSQL database (connected via v0 integration)
- Google Gemini API key
- Better Auth Secret (≥32 chars)

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your project settings (Vars section):

```
DATABASE_URL=postgresql://your-neon-connection-string
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
GEMINI_API_KEY=your-google-gemini-api-key
```

**To generate BETTER_AUTH_SECRET**, run:
```bash
openssl rand -base64 32
```

### 2. Database Setup

The database tables are already created via Neon MCP:
- `user` - Better Auth user table
- `session` - Session management
- `account` - OAuth/auth account data
- `verification` - Email verification tokens
- `cvs` - User CV storage
- `cv_optimizations` - Optimization history and results

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action.

## 📝 Usage

1. **Sign Up**: Create an account with email and password
2. **Upload CV**: Choose a PDF, DOCX, or TXT file containing your resume
3. **Paste Job Description**: Provide the target job posting
4. **Get Optimization**: Click "Optimize CV" to get:
   - AI-tailored CV content with relevant metrics
   - ATS compatibility score (0-100%)
   - List of key skills/requirements
   - Specific feedback on optimization
5. **Download**: Export your optimized CV as a PDF

## 🔄 Optimization Process

The app uses Gemini API with 3-step optimization:

1. **Job Analysis**: Extracts key technical skills and requirements
2. **CV Tailoring**: Rewrites CV to match job requirements with quantified metrics
3. **ATS Scoring**: Evaluates keyword match, formatting, and relevance

All API calls include automatic retry with exponential backoff (3 attempts) for reliability.

## 🛡️ Error Handling & Resilience

- **Global Error Boundary**: Catches React rendering errors
- **Auto-Retry System**: Failed API calls retry with exponential backoff (1s, 2s, 4s)
- **Fallback UIs**: Clean error screens instead of white screens
- **Graceful Degradation**: Missing data or API failures show user-friendly messages
- **Loading States**: Real-time progress feedback during optimization
- **Safe Async Operations**: Wrapped async functions with proper error handling

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```
app/
  api/auth/[...all]/     - Better Auth handler
  actions/               - Server actions for CV management & Gemini AI
  layout.tsx            - Root layout with fonts and metadata
  globals.css           - Tailwind v4 styling with design tokens
  page.tsx              - Protected dashboard page
  error.tsx             - Global error handler
  sign-in/              - Sign-in page
  sign-up/              - Sign-up page

components/
  dashboard.tsx         - Main optimization interface
  cv-upload-form.tsx    - File upload with parsing
  cv-list.tsx           - Stored CVs list
  optimization-result.tsx - Results display
  pdf-download.tsx      - PDF generation & download
  auth-form.tsx         - Sign-in/up form
  error-boundary.tsx    - React error boundary

lib/
  auth.ts               - Better Auth server config
  auth-client.ts        - Better Auth React client
  db/
    index.ts            - Drizzle ORM setup
    schema.ts           - Database schema
  error-utils.ts        - Retry logic & error handling
```

## 🔐 Security

- Session-based authentication with Better Auth
- Per-user data scoping (all queries filtered by userId)
- No foreign key constraints on app tables (simpler schema iteration)
- Environment variables properly isolated
- CORS-safe cross-site iframe cookies in dev mode

## 📄 License

MIT

## 🤝 Support

For issues or feature requests, check the application error logs or contact support.

---

Built with ❤️ using Next.js, Gemini AI, and Neon
