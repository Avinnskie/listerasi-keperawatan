# 🏥 Literasi Keperawatan

**Literasi Keperawatan** adalah platform pembelajaran digital yang dirancang khusus untuk kader kesehatan dan masyarakat yang ingin memperdalam pemahaman tentang topik-topik kesehatan penting. Platform ini menyediakan berbagai modul pembelajaran yang mencakup kesehatan kardiovaskular, informasi terkini COVID-19, dan dasar-dasar keperawatan.

## 🎯 Fitur Utama

- **📚 Modul Pembelajaran Interaktif** - Berbagai modul pembelajaran dengan konten yang terstruktur
- **🧪 Sistem Testing** - Pre-test dan Post-test untuk mengukur pemahaman
- **👤 Manajemen User** - Sistem otentikasi dengan role-based access (Admin/User)
- **🔍 Pencarian Materi** - Fitur pencarian untuk menemukan materi dengan mudah
- **📱 Responsive Design** - Tampilan yang optimal di semua perangkat
- **🎨 UI Modern** - Menggunakan shadcn/ui dengan Tailwind CSS

## 🛠️ Teknologi yang Digunakan

### Framework & Runtime

- **[Next.js 15.4.5](https://nextjs.org/)** - React framework dengan App Router
- **[React 19.1.0](https://reactjs.org/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Node.js](https://nodejs.org/)** - JavaScript runtime

### Database & ORM

- **[Prisma 6.13.0](https://www.prisma.io/)** - Database toolkit dan ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Database relational

### Authentication

- **[NextAuth.js 4.24.11](https://next-auth.js.org/)** - Authentication library
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components
- **[Radix UI](https://www.radix-ui.com/)** - Primitive UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Content & Editor

- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown renderer
- **[MDX Editor](https://mdxeditor.dev/)** - Rich text editor
- **[Quill](https://quilljs.com/)** - WYSIWYG editor

### Development Tools

- **[ESLint](https://eslint.org/)** - Linting tool
- **[Prettier](https://prettier.io/)** - Code formatter
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Commitlint](https://commitlint.js.org/)** - Commit message linting

## 📁 Struktur Folder

```
literasikeperawatan/
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── admin/                    # Admin dashboard routes
│   │   │   ├── materi/              # Material management
│   │   │   └── page.tsx
│   │   ├── api/                     # API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── materi/             # Material CRUD operations
│   │   │   ├── question/           # Question management
│   │   │   ├── search/             # Search functionality
│   │   │   ├── step/               # Step management
│   │   │   └── test/               # Test operations
│   │   ├── modul/                  # Public module pages
│   │   │   └── [slug]/             # Dynamic routes for modules
│   │   ├── login/                  # Login page
│   │   ├── unauthorized/           # Unauthorized access page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Global styles
│   ├── components/                 # React components (Atomic Design)
│   │   ├── atoms/                 # Basic UI elements
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── ...
│   │   ├── molecules/             # Combined atoms
│   │   │   ├── card.tsx
│   │   │   ├── form-field.tsx
│   │   │   ├── navigation-bar.tsx
│   │   │   └── ...
│   │   ├── organisms/             # Complex UI sections
│   │   │   ├── admin-data-table.tsx
│   │   │   ├── landing-page.tsx
│   │   │   ├── search-dialog.tsx
│   │   │   └── ...
│   │   ├── templates/             # Page layouts
│   │   ├── providers/             # Context providers
│   │   ├── layout/               # Layout components
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/                      # Utility libraries
│   │   ├── utils/               # Helper functions
│   │   ├── data/               # Static data
│   │   ├── prisma.ts           # Prisma client
│   │   ├── utils.ts            # Common utilities
│   │   └── enum.ts             # Type definitions
│   └── types/                   # TypeScript definitions
│       ├── materi.ts
│       └── next-auth.d.ts
├── prisma/                      # Database schema
│   └── schema.prisma
├── public/                      # Static assets
├── .husky/                      # Git hooks
├── .next/                       # Next.js build output
├── node_modules/                # Dependencies
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── middleware.ts               # Next.js middleware
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.mjs           # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── components.json             # shadcn/ui configuration
└── README.md                   # Project documentation
```

## 🚀 Instalasi dan Setup

### Prerequisites

Pastikan Anda telah menginstall:

- **Node.js** (versi 18.17 atau lebih baru)
- **npm**, **yarn**, **pnpm**, atau **bun**
- **PostgreSQL** database

### 1. Clone Repository

```bash
git clone <repository-url>
cd literasikeperawatan
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

### 3. Setup Environment Variables

Salin file `.env.example` ke `.env` dan konfigurasikan variabel environment:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"

# Supabase (optional)
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_KEY="your-anon-key"
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

## 📋 Scripts yang Tersedia

```bash
# Development
npm run dev          # Start development server dengan Turbopack
npm run build        # Build production application
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code dengan Prettier

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database

# Git Hooks
npm run prepare      # Setup Husky git hooks
```

## 🗃️ Database Schema

Aplikasi menggunakan PostgreSQL dengan Prisma ORM. Berikut adalah model utama:

### User Management

- **User**: Manajemen pengguna dengan role-based access
- **Role**: ADMIN | USER

### Content Management

- **Materi**: Modul pembelajaran dengan kategori dan tipe
- **Step**: Langkah-langkah dalam setiap materi
- **Test**: Pre-test dan Post-test untuk setiap materi
- **Question**: Pertanyaan untuk test
- **StepQuestion**: Pertanyaan untuk setiap step
- **CategoryOverview**: Overview untuk setiap kategori

## 🎨 Design System

Aplikasi menggunakan **Atomic Design Pattern** dengan struktur:

- **Atoms**: Komponen dasar (Button, Input, Label)
- **Molecules**: Kombinasi atoms (Card, FormField, NavigationBar)
- **Organisms**: Komponen kompleks (DataTable, SearchDialog, LandingPage)
- **Templates**: Layout halaman
- **Pages**: Halaman lengkap

## 🔐 Authentication & Authorization

- **NextAuth.js** untuk sistem otentikasi
- **Role-based access control** (RBAC)
- **Middleware protection** untuk route admin
- **Session management** dengan JWT

### User Roles:

- **ADMIN**: Akses penuh ke admin dashboard
- **USER**: Akses ke konten pembelajaran

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

### Content Management

- `GET /api/materi` - Get all materials
- `GET /api/materi/[slug]` - Get specific material
- `POST /api/materi` - Create new material (Admin)
- `PUT /api/materi/[slug]` - Update material (Admin)
- `DELETE /api/materi/[slug]` - Delete material (Admin)

### Search & Testing

- `GET /api/search` - Search materials
- `GET /api/test` - Get test questions
- `POST /api/test` - Submit test answers

## 🌍 Deployment

### Vercel (Recommended)

1. Push kode ke repository GitHub
2. Connect repository ke [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy secara otomatis

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

### Commit Convention

Proyek ini menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: update styling
refactor: code refactoring
test: add tests
chore: update dependencies
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Pastikan PostgreSQL berjalan
   - Periksa DATABASE_URL di `.env`
   - Jalankan `npx prisma db push`

2. **Build Errors**
   - Hapus folder `.next` dan `node_modules`
   - Install ulang dependencies
   - Jalankan `npm run build`

3. **Authentication Issues**
   - Periksa NEXTAUTH_SECRET di `.env`
   - Pastikan session provider terkonfigurasi dengan benar

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa [documentation](README.md)
2. Cari di [Issues](../../issues)
3. Buat [Issue baru](../../issues/new) jika diperlukan
