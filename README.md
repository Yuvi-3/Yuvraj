# Yuvraj Dutt — Portfolio

A modern developer portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion**, and **Firebase**. The website serves as the central hub for my work in **quantitative finance**, **machine learning**, **artificial intelligence**, **systems programming**, and **open-source software**.

The portfolio showcases my technical projects, research interests, work experience, publications, blogs, and open-source contributions while providing a minimal, fast, and responsive browsing experience.

---

## Overview

This portfolio is built as a **Single Page Application (SPA)** using the **Next.js App Router**. Instead of navigating between multiple pages, every section is rendered dynamically with smooth client-side transitions for a seamless experience.

A dedicated admin dashboard allows content management without editing source code, making it easy to update news, experiences, projects, and publications.

---

## Key Design Decisions

- **Single Route SPA Architecture** — Fast client-side navigation without page reloads.
- **Modern Minimal UI** — Inspired by clean academic and developer portfolios.
- **Firebase-backed Dynamic Content** — News and updates are stored in Firestore.
- **Responsive Design** — Optimized for desktop, tablet, and mobile.
- **Standalone Deployment** — Configured for Docker and self-hosted deployments.
- **Highly Extensible Architecture** — Easy to add new sections, projects, blogs, and publications.

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI) |
| Runtime | Bun |
| Database | Firebase Firestore |
| Authentication | Firebase |
| Animations | Framer Motion |
| Icons | Lucide React |
| ORM | Prisma (Scaffolded) |
| State Management | Zustand |
| Data Fetching | TanStack React Query |
| Deployment | Standalone Output / Docker |

---

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout (Inter font, metadata)
│   ├── page.tsx            # Main SPA entry — tab routing + page rendering
│   ├── globals.css         # Tailwind imports, global reset, base styles
│   ├── admin/
│   │   └── page.tsx        # Password-gated news management panel
│   └── api/
│       └── route.ts        # API route (scaffolded)
├── components/
│   ├── Header.tsx          # Top navigation bar (social icons + tab links)
│   ├── Footer.tsx          # Footer with copyright
│   ├── scroll-progress.tsx # Fixed scroll progress indicator
│   ├── ui/                 # shadcn/ui component library (40+ components)
│   └── pages/
│       ├── AboutPage.tsx       # Bio, photo, location, Firebase news feed
│       ├── BlogPage.tsx        # Blog listing with tag filtering + pagination
│       ├── BlogPostPage.tsx    # Individual blog post with custom markdown renderer
│       ├── ExperiencesPage.tsx # Education + work history timeline
│       ├── OpenSourcePage.tsx  # Open-source project contributions
│       ├── PublicationsPage.tsx# Academic publications list
│       ├── TeachingPage.tsx    # Teaching and mentoring entries
│       ├── TalksPage.tsx       # Conference talks and presentations
│       ├── GrantsPage.tsx      # Grants and scholarships received
│       └── CvPage.tsx          # CV download placeholder
├── data/
│   ├── blogs.ts            # Blog posts (full content, tags, metadata)
│   └── experiences.ts      # Education + work experience entries
├── lib/
│   ├── firebase.ts         # Firebase init, Firestore CRUD (news)
│   ├── db.ts               # Prisma client (scaffolded)
│   └── utils.ts            # Utility functions (cn helper)
└── hooks/
    ├── use-toast.ts        # Toast notification hook
    └── use-mobile.ts       # Mobile detection hook
```

---

## Pages & Features

### About

The landing page introduces **Yuvraj Dutt** and provides an overview of my background.

Highlights include:

- Quantitative Finance enthusiast
- Machine Learning Engineer
- Open Source Contributor
- AI & Systems Programming Developer
- Research interests
- Current projects
- Contact information
- Social profiles
- Dynamic news feed powered by Firebase

### Blog

Technical blogs and engineering articles covering topics such as:

- Machine Learning
- Artificial Intelligence
- Quantitative Finance
- Algorithms
- C++
- Python
- Systems Programming
- Developer Tools
- Software Engineering

Features include:

- Tag filtering
- Pagination
- Markdown rendering
- Code syntax highlighting

### Experiences

Timeline of education and professional experience.

Includes:

#### Education

- Delhi University (Upcoming)
- Self-directed study in Mathematics, Computer Science and Quantitative Finance

#### Experience

- Open Source Contributor
- SkillCraft Technologies Internship
- Independent AI & Quantitative Finance Projects

### Open Source

A curated collection of my open-source work including:

- ApproxLab
- HeyGen Hyperframes Contributions
- AI Developer Tools
- Quantitative Finance Projects
- Research Utilities

Links to GitHub repositories and contribution history are included.

### Publications

Technical write-ups, research notes and future publications covering:

- Machine Learning
- Quantitative Finance
- Deep Learning
- Artificial Intelligence
- Systems Programming
- Algorithms

### Teaching

Educational resources including:

- Programming Tutorials
- Technical Documentation
- AI Notes
- Quantitative Finance Learning Material
- Developer Guides

### Talks

Conference talks, workshops, technical presentations and future speaking engagements.

### Grants & Awards

Scholarships, recognitions, research grants and future achievements.

### CV

A downloadable resume highlighting:

- Technical Skills
- Projects
- Experience
- Open Source Contributions
- Research Interests
- Achievements

---

## Admin Panel

The portfolio includes a password-protected admin dashboard.

Features include:

- Manage news posts
- Add or delete updates
- Dynamic Firebase integration
- Secure authentication
- Real-time portfolio updates

---

## Design System

| Property | Value |
|----------|-------|
| Font | Inter |
| Framework | Tailwind CSS |
| Responsive | Yes |
| Animations | Framer Motion |
| Theme | Minimal Modern |
| Layout | Academic / Developer Portfolio |

---

## Getting Started

### Prerequisites

- Bun (recommended) or Node.js 18+
- Firebase Project (optional)

### Installation

```bash
git clone <repository-url>
cd portfolio
bun install
```

---

## Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_PASSWORD=
DATABASE_URL=file:./db/custom.db
```

---

## Development

```bash
# Start development server on port 3000
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

---

## Database Commands

```bash
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:reset
```

---

## Deployment

The project uses **Next.js Standalone Output** for production deployment.

```bash
bun run build
```

Supports:

- Docker
- VPS
- Railway
- Render
- Vercel
- Self Hosting

---

## Content Management

### Blog Posts

Stored as structured data and rendered with Markdown.

### News

Managed dynamically using Firebase Firestore through the Admin Panel.

### Projects

Can be updated by modifying the project data source or integrating Firebase collections.

---

## Navigation

```
Header
├── Social Links
├── Yuvraj Dutt
├── About
├── Blog
├── Experiences
├── Open Source
├── Publications
├── Teaching
├── Talks
├── Grants
└── CV
```

---

## Core Technologies

- Next.js
- TypeScript
- Tailwind CSS
- Firebase
- Prisma
- Framer Motion
- React
- Bun
- Lucide React
- Radix UI
- Zustand
- TanStack Query
- Markdown
- Docker

---

## Roadmap

Upcoming features include:

- Research Portfolio
- Project Showcase CMS
- Publications Management
- Dynamic Experience Editor
- Project Analytics Dashboard
- Dark / Light Theme Toggle
- Interactive Timeline
- Advanced Search
- AI-powered Blog Assistant
- GitHub Activity Integration

---

## License

This project is the personal portfolio of **Yuvraj Dutt**.

All original content, projects, designs, code, and documentation are © Yuvraj Dutt unless otherwise stated.

---

## Acknowledgements

Inspired by modern academic and developer portfolio websites.

Designed and developed by **Yuvraj Dutt** using:

- Next.js
- TypeScript
- Tailwind CSS
- Firebase
- Framer Motion
- shadcn/ui