# Forms Dashboard Mini-App

A modern forms management system with role-based authentication, CSV export, and real-time updates.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## ✨ Features

- **Full CRUD Operations** - Create, read, update, delete forms
- **Role-Based Access** - Admin (full access) and Individual (view-only) roles
- **NextAuth Integration** - Secure JWT session-based authentication
- **CSV Export** - Download forms data with one click
- **Confirmation Modals** - Accessible dialogs for destructive actions
- **Advanced Filtering** - Filter by status, sort by any column
- **Form Validation** - React Hook Form + Zod schemas
- **Toast Notifications** - Real-time feedback for all actions
- **SEO Optimized** - Dynamic metadata for all pages
- **Responsive Design** - Mobile-first with Tailwind CSS v4

## 🛠️ Tech Stack

**Core:** Next.js 15 (App Router) • TypeScript • React 19 • Tailwind CSS v4  
**Auth:** NextAuth v5 (JWT sessions)  
**Forms:** React Hook Form • Zod validation  
**State:** Zustand • React Toastify

- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Data Storage**: File-based JSON storage (in-memory for demo)

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup Steps

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Generate a secure secret and add it to `.env.local`:

```bash
openssl rand -base64 32
```

Edit `.env.local`:

```env
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Run the development server**

```bash
npm run dev
```

## 🎯 Usage

**Login:** Go to `/login` → Enter email → Select role (Admin/Individual)

**Admin:** Create, edit, delete forms • Export CSV • View dashboard  
**Individual:** View forms (read-only) • Filter and sort

## � Environment Variables

Create `.env.local` with:

```env
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 API Routes

- `GET /api/forms` - List all forms
- `POST /api/forms` - Create form (Admin only)
- `GET /api/forms/[id]` - Get single form
- `PUT /api/forms/[id]` - Update form (Admin only)
- `DELETE /api/forms/[id]` - Delete form (Admin only)