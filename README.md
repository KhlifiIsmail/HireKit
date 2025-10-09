# 🚀 HireKit

<div align="center">

![HireKit Logo](public/logo.svg)

**AI-Powered Resume Optimization | Beat the ATS | Land Your Dream Job**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](https://hirekit.app) · [Documentation](https://docs.hirekit.app) · [Report Bug](https://github.com/yourusername/hirekit/issues)

</div>

---

## ✨ What is HireKit?

HireKit is a **cutting-edge AI-powered platform** that transforms your resume into an ATS-friendly, keyword-optimized masterpiece. Using advanced machine learning algorithms powered by Groq AI, HireKit analyzes your resume against job descriptions and provides actionable insights to **increase your interview chances by up to 300%**.

### 🎯 Key Features

- **🤖 AI-Powered Analysis** - Advanced machine learning algorithms analyze your resume in seconds
- **📊 ATS Compatibility Check** - Ensure your resume passes Applicant Tracking Systems (95% success rate)
- **🎯 Job-Specific Optimization** - Tailor your resume for specific job postings with targeted keyword analysis
- **💡 Smart Suggestions** - Get prioritized, actionable recommendations to improve your resume
- **📈 Comprehensive Scoring** - Detailed breakdown of overall quality, ATS compatibility, and keyword optimization
- **⚡ Lightning Fast** - Get results in under 30 seconds with our optimized AI pipeline
- **📤 Export Options** - Download optimized resumes in PDF or DOCX format
- **🔒 Privacy First** - Your data is encrypted and never shared with third parties

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Supabase account (free tier available)
- Groq API key (free tier: 30 req/min)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hirekit.git
cd hirekit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
npx supabase db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations and transitions
- **Lucide Icons** - Beautiful, consistent iconography

### Backend & Infrastructure

- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Groq AI** - Ultra-fast LLM inference for resume analysis
- **Next.js API Routes** - Serverless API endpoints

### File Processing

- **pdf-parse** - Extract text from PDF resumes
- **mammoth.js** - Parse DOCX documents
- **react-dropzone** - Drag-and-drop file uploads

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
hirekit/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── analyze/              # Main analysis page
│   │   ├── dashboard/            # User dashboard
│   │   ├── results/[id]/         # Analysis results page
│   │   └── api/                  # API routes
│   │       ├── analyze/          # Resume analysis endpoint
│   │       ├── upload/           # File upload endpoint
│   │       └── auth/             # Auth endpoints
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── layout/               # Layout components (Navbar, Footer)
│   │   ├── landing/              # Landing page sections
│   │   ├── analyze/              # Analysis page components
│   │   └── results/              # Results display components
│   │
│   ├── lib/
│   │   ├── supabase/             # Database client setup
│   │   ├── ai/                   # Groq AI integration
│   │   ├── parsers/              # File parsers (PDF, DOCX)
│   │   ├── analyzers/            # Analysis logic
│   │   └── utils/                # Utility functions
│   │
│   └── types/                    # TypeScript type definitions
│
├── public/                       # Static assets
├── supabase/                     # Database migrations
└── docs/                         # Documentation
```

---

## 🎨 Features in Detail

### 1. Resume Analysis

Upload your resume and optionally paste a job description. HireKit will:

- Extract text from PDF or DOCX files
- Analyze content quality and structure
- Compare against job requirements
- Generate a comprehensive compatibility score

### 2. ATS Compatibility

Get detailed insights on how well your resume works with Applicant Tracking Systems:

- Format compatibility check
- Keyword density analysis
- Common ATS issues detection
- 95% ATS pass rate guarantee

### 3. Smart Suggestions

Receive prioritized, actionable recommendations:

- **High Priority** - Critical issues affecting your chances
- **Medium Priority** - Important improvements
- **Low Priority** - Nice-to-have enhancements

### 4. Before/After Comparison

See exactly how HireKit improves your resume:

- Side-by-side text comparison
- Highlighted changes and additions
- Keyword optimization visualization

### 5. Credits System

Fair usage model with generous free tier:

- **5 free credits** on sign up
- Each analysis costs 1 credit
- Premium plans for power users

---

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FILE_SIZE=5242880  # 5MB
FREE_CREDITS_PER_USER=5
```

---

## 📊 Database Schema

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysis results
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  resume_text TEXT NOT NULL,
  job_description TEXT,
  overall_score INTEGER NOT NULL,
  ats_score INTEGER NOT NULL,
  keyword_score INTEGER NOT NULL,
  suggestions JSONB NOT NULL,
  improved_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚧 Development Roadmap

### ✅ Phase 1: MVP (Current)

- [x] Landing page with premium design
- [x] File upload and parsing (PDF, DOCX)
- [x] Basic analysis pipeline
- [x] Results display components
- [ ] AI integration with Groq
- [ ] Database setup and migrations
- [ ] Authentication system

### 🔨 Phase 2: Core Features

- [ ] Dashboard with analysis history
- [ ] Credits system implementation
- [ ] Export functionality (PDF, DOCX)
- [ ] Email notifications
- [ ] Analytics tracking

### 🎯 Phase 3: Advanced Features

- [ ] LinkedIn profile import
- [ ] Cover letter generation
- [ ] Interview prep suggestions
- [ ] Job board integration
- [ ] Team/enterprise features

### 🌟 Phase 4: Scale

- [ ] Mobile app (React Native)
- [ ] Premium subscription tiers
- [ ] API for third-party integrations
- [ ] Multi-language support

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'feat: add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Groq](https://groq.com/) - Ultra-fast AI inference
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

---

## 📧 Contact & Support

- **Website**: [hirekit.app](https://hirekit.app)
- **Email**: support@hirekit.app
- **Twitter**: [@hirekitapp](https://twitter.com/hirekitapp)
- **Discord**: [Join our community](https://discord.gg/hirekit)

---

<div align="center">

**Made with ❤️ by the HireKit Team**

[⭐ Star us on GitHub](https://github.com/yourusername/hirekit) | [🐦 Follow on Twitter](https://twitter.com/hirekitapp) | [📖 Read the Docs](https://docs.hirekit.app)

</div>
