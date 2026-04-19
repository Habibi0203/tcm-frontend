# CODEX BRIEF — tcm.my.id
# "Belajar TCM, Bersama."
# Frontend (Phase 1 — Mock Data)
# Version: 3.0 | April 2026
# Changelog v3: +Zustand store shape, +React Query setup, +Tiptap usage spec,
#   +form validation rules, +SEO per-page, +Dashboard spec lengkap,
#   +notifikasi dropdown, +reply nesting rule, +translate behavior,
#   +ArticleCard toggle, +counter animation, +error boundary, +/tentang page

---

## SEBELUM MULAI

```bash
mkdir tcm-frontend && cd tcm-frontend
git init
git commit --allow-empty -m "init"
```

Buat file `AGENTS.md` di root folder:
```markdown
# tcm.my.id Frontend

Platform komunitas Traditional Chinese Medicine Indonesia.
Stack: Next.js 14, Tailwind CSS, Zustand, React Query.
Semua data saat ini menggunakan mock data lokal di /src/mock/.
Struktur mock data mengikuti PostgreSQL schema v4.
Bahasa konten: Indonesia (default). English via translate toggle.
Reply forum: 1 level nesting saja (reply ke reply tidak diizinkan).
Auth state: Zustand authStore — TIDAK pakai next-auth session.
Tiptap editor: dipakai di halaman tulis artikel (/artikel/tulis) dan form reply forum.
```

---

## CONTEXT & MISSION

Kamu akan membangun frontend website komunitas Traditional Chinese Medicine (TCM) Indonesia bernama tcm.my.id — tempat belajar, berbagi, dan berdiskusi TCM dalam suasana yang nyaman, rapi, dan tidak terasa seperti berjualan.

**Stack yang harus digunakan:**
```json
{
  "next": "14.2.20",
  "react": "18.3.1",
  "tailwindcss": "3.4.x",
  "zustand": "^4.5.x",
  "@tanstack/react-query": "^5.x",
  "lucide-react": "latest",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-placeholder": "^2.x"
}
```

Pin versi Next.js di **14.2.20** — jangan upgrade ke 15.

**JANGAN install:** next-auth, shadcn, MUI, Chakra, atau component library lain.

**Penting:** Semua data menggunakan mock data lokal di `/src/mock/`. Struktur mock HARUS mengikuti schema database v4 yang sudah ada.

---

## DESIGN DIRECTION

**Tone:** Natural, organic, editorial — seperti majalah kesehatan premium Asia. Bersih tapi berkarakter. Tidak steril seperti SaaS, tidak ramai seperti marketplace.

**CSS Variables (tambahkan ke globals.css dan tailwind.config.ts):**
```css
:root {
  --color-primary:       #1D9E75;
  --color-primary-dark:  #0F6E56;
  --color-primary-light: #E1F5EE;
  --color-amber:         #BA7517;
  --color-amber-light:   #FAEEDA;
  --color-purple:        #3C3489;
  --color-surface:       #F8F7F4;
  --color-card:          #FFFFFF;
  --color-text:          #1A1A1A;
  --color-muted:         #6B6B68;
  --color-border:        #E5E3DD;
}
```

**Typography:**
- Display/Heading : "Playfair Display" — judul artikel & hero
- Body/UI         : "DM Sans" — semua UI & body text
- Mono            : "JetBrains Mono" — kode/teknis

Setup via `next/font/google` di `/src/app/layout.tsx`.

**5 Prinsip UI yang tidak boleh dilanggar:**
1. Badge free/premium kecil dan halus — bukan overlay agresif
2. Premium gate: modal bisa ditutup (ada tombol X) — tone informatif
3. Forum terasa hangat seperti komunitas, bukan papan pengumuman
4. Semua halaman responsif mobile — test di 375px dan 768px
5. Reading experience artikel: max-width 700px, centered, line-height 1.8

---

## ZUSTAND AUTH STORE

Buat `/src/store/authStore.ts` dengan shape berikut:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MockUser } from '@/mock/users'

type AuthStore = {
  user: MockUser | null
  isAuthenticated: boolean
  // Actions
  login: (user: MockUser) => void
  logout: () => void
  updateUser: (partial: Partial<MockUser>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: 'tcm-auth' }
  )
)
```

Auth state berasal dari Zustand saja — tidak pakai next-auth session.

---

## REACT QUERY SETUP

Buat `/src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 menit
      gcTime: 1000 * 60 * 30,     // 30 menit
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

Buat `/src/lib/queryKeys.ts` — semua query key di satu tempat:
```typescript
export const QK = {
  articles: {
    all: ['articles'] as const,
    list: (filters: object) => ['articles', 'list', filters] as const,
    detail: (slug: string) => ['articles', 'detail', slug] as const,
  },
  forum: {
    subforums: ['forum', 'subforums'] as const,
    threads: (slug: string, filters: object) => ['forum', 'threads', slug, filters] as const,
    thread: (id: string) => ['forum', 'thread', id] as const,
  },
  user: {
    me: ['user', 'me'] as const,
    bookmarks: ['user', 'bookmarks'] as const,
    notifications: ['user', 'notifications'] as const,
  },
}
```

Wrap `{children}` di `/src/app/layout.tsx` dengan `<QueryClientProvider client={queryClient}>`.

---

## TIPTAP EDITOR — SPEC PENGGUNAAN

Tiptap dipakai di **dua tempat**:

**1. Form Tulis Artikel `/artikel/tulis`** (halaman baru):
- Extensions: StarterKit + Placeholder
- Placeholder: "Tulis konten artikelmu di sini..."
- Toolbar: Bold, Italic, Heading (H2, H3), BulletList, OrderedList, Blockquote, HorizontalRule
- Field lain: title (input biasa), category (select), access_tier (radio), tags (input chips)
- Submit: tampilkan alert "Artikel dikirim untuk review" (mock — belum ke API)
- Hanya tampil jika user sudah login (redirect ke /masuk jika belum)

**2. Form Reply Forum** (di dalam halaman `/forum/[slug]/[id]`):
- Extensions: StarterKit + Placeholder
- Placeholder: "Tulis balasanmu..."
- Toolbar minimal: Bold, Italic, BulletList saja
- Min panjang: 10 karakter
- Submit: tambahkan reply ke local state (mock — belum ke API)
- Tampil untuk semua user yang sudah login

---

## FORM VALIDATION RULES

**Register `/daftar`:**
```
email         : required, format email valid
username      : required, 3-20 karakter, hanya [a-z0-9_], tidak boleh spasi
display_name  : required, 2-50 karakter
password      : required, min 8 karakter, harus ada huruf + angka
confirm_pass  : harus match password
profession    : required, pilih dari: general | practitioner | student
```

**Login `/masuk`:**
```
email         : required, format email valid
password      : required, min 1 karakter
```

Validasi dilakukan client-side dengan fungsi sederhana (bukan library) — tampilkan error di bawah field yang bermasalah.

---

## SEO PER HALAMAN

Buat di setiap `page.tsx` menggunakan Next.js `export const metadata`:

```
/                   → title: "tcm.my.id — Belajar TCM, Bersama"
                      description: "Platform komunitas Traditional Chinese Medicine Indonesia..."
/artikel            → title: "Artikel TCM | tcm.my.id"
                      description: "Baca artikel TCM pilihan..."
/artikel/[slug]     → title: "{article.title} | tcm.my.id"
                      description: "{article.seo_description atau 120 karakter pertama konten}"
/kategori/[slug]    → title: "{category.name} | Artikel TCM"
/forum              → title: "Forum Komunitas | tcm.my.id"
/forum/[slug]       → title: "{subforum.name} | Forum TCM"
/forum/[slug]/[id]  → title: "{thread.title} | Forum TCM"
/dashboard          → title: "Dashboard | tcm.my.id"
/profil/[username]  → title: "{user.display_name} | tcm.my.id"
/tentang            → title: "Tentang tcm.my.id"
/daftar             → title: "Daftar Akun | tcm.my.id"
/masuk              → title: "Masuk | tcm.my.id"
```

---

## MOCK DATA LENGKAP

Buat semua file ini di `/src/mock/` sebelum build halaman apapun.

### `/src/mock/users.ts`
```typescript
export type MockUser = {
  id: string
  email: string
  username: string
  display_name: string
  avatar_url: string
  bio: string
  profession: 'general' | 'practitioner' | 'student'
  role: 'member' | 'moderator' | 'admin' | 'agent'
  membership_tier: 'free' | 'premium'
  is_verified: boolean
  is_active: boolean
  created_at: string
}

export const mockUsers: MockUser[] = [
  {
    id: "usr_001",
    email: "admin@tcm.my.id",
    username: "admin_tcm",
    display_name: "Admin TCM",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75",
    bio: "Administrator tcm.my.id — Platform komunitas TCM Indonesia.",
    profession: "practitioner",
    role: "admin",
    membership_tier: "premium",
    is_verified: true,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "usr_002",
    email: "dr.sari@example.com",
    username: "dr_sari_wijaya",
    display_name: "Dr. Sari Wijaya",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=0C447C",
    bio: "Praktisi TCM bersertifikat dengan pengalaman 12 tahun. Spesialisasi akupuntur, herbal, dan pengobatan holistik.",
    profession: "practitioner",
    role: "member",
    membership_tier: "premium",
    is_verified: true,
    is_active: true,
    created_at: "2026-01-15T00:00:00Z"
  },
  {
    id: "usr_003",
    email: "budi.santoso@example.com",
    username: "budi_sehat",
    display_name: "Budi Santoso",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=534AB7",
    bio: "Belajar TCM untuk menjaga kesehatan keluarga. Tertarik herbal dan gaya hidup sehat.",
    profession: "general",
    role: "member",
    membership_tier: "free",
    is_verified: true,
    is_active: true,
    created_at: "2026-02-01T00:00:00Z"
  },
  {
    id: "usr_004",
    email: "rina.herbal@example.com",
    username: "rina_herbal",
    display_name: "Rina Kusuma",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517",
    bio: "Mahasiswa TCM semester akhir. Suka berbagi ilmu tentang herbal Indonesia.",
    profession: "student",
    role: "member",
    membership_tier: "premium",
    is_verified: true,
    is_active: true,
    created_at: "2026-02-15T00:00:00Z"
  },
  {
    id: "usr_005",
    email: "hendra@example.com",
    username: "hendra_qi",
    display_name: "Hendra Pranata",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=HendraPranata&backgroundColor=993C1D",
    bio: "Penggemar Qi Gong dan meditasi TCM. Rutin berlatih setiap pagi.",
    profession: "general",
    role: "member",
    membership_tier: "free",
    is_verified: true,
    is_active: true,
    created_at: "2026-03-01T00:00:00Z"
  }
]

// Untuk simulasi state login — ganti index untuk test role berbeda
// [2] = free member, [1] = premium member, [0] = admin
export let mockCurrentUser: MockUser | null = mockUsers[2]
```

### `/src/mock/categories.ts`
```typescript
export const mockCategories = [
  { id: "cat_001", name: "Edukasi TCM Dasar", slug: "edukasi-tcm-dasar",
    color_hex: "#1D9E75", description: "Fondasi dan filosofi TCM untuk pemula", sort_order: 1, is_active: true },
  { id: "cat_002", name: "Herbal & Tanaman Obat", slug: "herbal-tanaman-obat",
    color_hex: "#3B6D11", description: "Khasiat, dosis, dan cara penggunaan herbal TCM", sort_order: 2, is_active: true },
  { id: "cat_003", name: "Akupuntur & Meridian", slug: "akupuntur-meridian",
    color_hex: "#0C447C", description: "Titik meridian, teknik akupuntur, dan manfaatnya", sort_order: 3, is_active: true },
  { id: "cat_004", name: "Protokol Kondisi Spesifik", slug: "protokol-kondisi-spesifik",
    color_hex: "#BA7517", description: "Panduan TCM per kondisi kesehatan", sort_order: 4, is_active: true },
  { id: "cat_005", name: "Gaya Hidup TCM", slug: "gaya-hidup-tcm",
    color_hex: "#534AB7", description: "Resep, rutinitas, Qi Gong, dan pola hidup sehat", sort_order: 5, is_active: true },
  { id: "cat_006", name: "Referensi Praktisi", slug: "referensi-praktisi",
    color_hex: "#993C1D", description: "Studi kasus dan referensi mendalam untuk terapis", sort_order: 6, is_active: true },
]
```

### `/src/mock/articles.ts`
*(Sama persis dengan v2 — 10 artikel lengkap dengan konten penuh. Lihat v2 untuk isi lengkapnya. Pastikan `content_id` adalah string markdown panjang dan `content_en` adalah string atau null.)*

### `/src/mock/subforums.ts`
*(Sama dengan v2 — 4 subforum)*

### `/src/mock/threads.ts`

Tambahkan mock replies di file yang sama:

```typescript
export type MockReply = {
  id: string
  thread_id: string
  author_id: string
  author: { display_name: string; avatar_url: string; membership_tier: string; role: string }
  content: string
  parent_reply_id: string | null   // null = top-level reply; string = reply ke reply (tampil indent)
  upvote_count: number
  is_deleted: boolean
  is_agent_reply: boolean
  created_at: string
}

export const mockReplies: MockReply[] = [
  {
    id: "rep_001", thread_id: "thr_001",
    author_id: "usr_002",
    author: { display_name: "Dr. Sari Wijaya", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=0C447C", membership_tier: "premium", role: "member" },
    content: "Pertanyaan yang bagus! Perbedaan utamanya: akupuntur menggunakan jarum tipis yang ditusukkan ke titik meridian, sementara akupresur menggunakan tekanan jari di titik yang sama. Keduanya efektif, tapi akupresur lebih cocok untuk pemula karena bisa dilakukan sendiri di rumah tanpa peralatan khusus.",
    parent_reply_id: null, upvote_count: 14, is_deleted: false, is_agent_reply: false,
    created_at: "2026-04-14T11:00:00Z"
  },
  {
    id: "rep_002", thread_id: "thr_001",
    author_id: "usr_004",
    author: { display_name: "Rina Kusuma", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517", membership_tier: "premium", role: "member" },
    content: "Menambahkan dari jawaban Dr. Sari: untuk kondisi nyeri otot akut, akupresur di titik ST36 (Zu San Li) atau LI4 (He Gu) bisa sangat membantu. Tekan dengan ibu jari, tekanan sedang, 1-2 menit per sisi.",
    parent_reply_id: "rep_001", upvote_count: 7, is_deleted: false, is_agent_reply: false,
    created_at: "2026-04-14T13:30:00Z"
  },
  {
    id: "rep_003", thread_id: "thr_001",
    author_id: "usr_003",
    author: { display_name: "Budi Santoso", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=534AB7", membership_tier: "free", role: "member" },
    content: "Terima kasih Dr. Sari dan Rina! Jadi akupresur dulu ya sebagai langkah awal. Nanti kalau sudah lebih yakin baru coba akupuntur dengan praktisi. Sangat membantu!",
    parent_reply_id: null, upvote_count: 3, is_deleted: false, is_agent_reply: false,
    created_at: "2026-04-15T09:00:00Z"
  }
]
```

**Aturan nesting reply:** **1 level saja.** Reply ke reply (`parent_reply_id` ada) ditampilkan indented di bawah parent-nya. Reply ke reply-dari-reply tidak diizinkan di UI — tombol "Balas" hanya muncul di top-level reply, dan form reply selalu menjadi top-level (bukan nested lebih dalam).

### `/src/mock/notifications.ts`

```typescript
export type MockNotification = {
  id: string
  user_id: string
  type: 'article_approved' | 'article_rejected' | 'new_reply' | 'reply_upvote' | 'system'
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
}

export const mockNotifications: MockNotification[] = [
  {
    id: "notif_001", user_id: "usr_003",
    type: "new_reply",
    title: "Dr. Sari membalas thread kamu",
    body: "Pertanyaan yang bagus! Perbedaan utamanya: akupuntur menggunakan...",
    link: "/forum/diskusi-umum/thr_001",
    is_read: false,
    created_at: "2026-04-14T11:00:00Z"
  },
  {
    id: "notif_002", user_id: "usr_003",
    type: "reply_upvote",
    title: "Balasanmu mendapat 7 upvote",
    body: "Di thread: Apa perbedaan akupuntur dan akupresur?",
    link: "/forum/diskusi-umum/thr_001",
    is_read: false,
    created_at: "2026-04-15T10:00:00Z"
  },
  {
    id: "notif_003", user_id: "usr_003",
    type: "system",
    title: "Selamat datang di tcm.my.id!",
    body: "Mulai perjalanan belajar TCM kamu dengan membaca artikel dasar.",
    link: "/artikel",
    is_read: true,
    created_at: "2026-02-01T00:00:00Z"
  }
]
```

### `/src/mock/stats.ts`
```typescript
export const mockPlatformStats = {
  total_articles: 124,
  total_members: 47,
  active_subforums: 4,
  verified_practitioners: 6
}
```

### `/src/mock/bookmarks.ts`
```typescript
// Mock bookmarks untuk mockUsers[2] (budi_sehat)
export const mockBookmarks = [
  { article_id: "art_001", bookmarked_at: "2026-04-11T10:00:00Z" },
  { article_id: "art_003", bookmarked_at: "2026-04-12T08:30:00Z" },
  { article_id: "art_005", bookmarked_at: "2026-04-14T19:00:00Z" },
]
```

### `/src/mock/index.ts`
```typescript
export * from './users'
export * from './categories'
export * from './articles'
export * from './subforums'
export * from './threads'
export * from './notifications'
export * from './stats'
export * from './bookmarks'
```

---

## STRUKTUR HALAMAN

### A. LAYOUT COMPONENTS (buat dulu)

**Navbar (`/src/components/layout/Navbar.tsx`)**
- Logo "tcm.my.id" di kiri (Playfair Display, teal)
- Nav links: Artikel, Forum, Tentang
- Kanan: toggle translate (ID|EN), lalu jika login: notifikasi bell + avatar menu; jika belum: tombol "Masuk"
- Sticky dengan backdrop blur saat scroll
- Mobile: hamburger → slide-in menu dari kanan

**Notifikasi Bell Dropdown:**
- Klik bell: dropdown muncul di bawah bell
- Header: "Notifikasi" + link "Tandai semua dibaca"
- List max 5 notifikasi terbaru dari `mockNotifications`
- Setiap item: title (bold jika belum dibaca), body (1 baris truncated), waktu relatif (misal: "2 jam lalu")
- Footer: link "Lihat semua notifikasi" → `/dashboard?tab=notifikasi`
- Badge merah di bell icon: tampilkan jumlah unread (sembunyikan jika 0)

**Dev-only Demo Login Dropdown:**
- Hanya tampil jika `process.env.NODE_ENV !== 'production'`
- Tombol "🔧 Demo" di kiri navbar (dekat logo), kecil, warna muted
- Dropdown: "Login sebagai Free Member" | "Login sebagai Premium" | "Login sebagai Admin" | "Logout"
- Aksi panggil `useAuthStore().login(mockUsers[x])` atau `logout()`

**Footer (`/src/components/layout/Footer.tsx`)**
- Logo + tagline "Belajar TCM, Bersama."
- 3 kolom: Kategori Artikel, Forum, Tentang
- Baris bawah: copyright + disclaimer medis singkat: "Konten di tcm.my.id bersifat edukatif, bukan pengganti konsultasi medis profesional."

---

### B. HALAMAN PUBLIK

**Beranda `/`**
Sections dari atas ke bawah:
1. **Hero:** headline "Belajar TCM, Bersama." + sub + 2 CTA button ("Mulai Belajar" → /artikel, "Gabung Komunitas" → /daftar) + background pattern teal organik
2. **Grid artikel terbaru:** 6 artikel (3 kolom desktop, 2 tablet, 1 mobile) — gunakan ArticleCard variant "grid"
3. **Kategori populer:** 6 kategori sebagai horizontal pill cards dengan warna category.color_hex
4. **Statistik komunitas:** 4 angka (total_articles, total_members, active_subforums, verified_practitioners) dengan animasi counter saat section masuk viewport — implementasi dengan `useEffect` + `requestAnimationFrame`, tanpa library tambahan
5. **Thread forum terbaru:** 5 thread cards sederhana (judul, subforum, reply_count, waktu)
6. **CTA Join:** full width teal background, "Bergabunglah dengan komunitas TCM Indonesia" + tombol daftar

**Daftar Artikel `/artikel`**
- Search bar + filter kategori (pills, multi-select) + sort dropdown (Terbaru | Terpopuler | Terlama)
- Toggle tampilan: **Grid** (default) ↔ **List** — simpan preferensi di localStorage `tcm-article-view`
  - Grid: ArticleCard variant "grid" (thumbnail besar di atas, 3 kolom)
  - List: ArticleCard variant "list" (thumbnail kecil di kiri, 1 kolom penuh)
- Pagination sederhana (prev/next + nomor halaman), 9 artikel per halaman

**Detail Artikel `/artikel/[slug]`**
- Layout 2 kolom: konten kiri (max 700px) + sidebar kanan sticky (di atas 1024px)
- Sidebar: info penulis, tombol like (toggle), tombol bookmark (toggle), daftar artikel related (sama kategori), share links
- Translate toggle ID|EN di atas konten (sticky saat scroll artikel):
  - State di URL param `?lang=en`
  - Klik EN: simulasi loading 1.5 detik (skeleton) → tampilkan `content_en`
  - Jika `content_en = null`: tampilkan pesan "Terjemahan belum tersedia" (jangan loading terus)
  - Klik ID: langsung ganti kembali tanpa delay
- Disclaimer box kuning (`has_disclaimer = true`): "Artikel ini memuat informasi medis. Selalu konsultasikan dengan praktisi TCM atau dokter sebelum menerapkan."
- **Premium gate** (jika `access_tier = 'premium'` dan user bukan premium):
  - Tampilkan 300 kata pertama artikel
  - Gradient fade ke bawah pada paragraf terakhir yang terlihat
  - Overlay modal **kecil di tengah konten** (bukan fullscreen):
    - Judul: "Lanjutkan membaca sebagai member premium"
    - 3 benefit: akses semua artikel, protokol klinis lengkap, forum Tanya Praktisi
    - CTA: "Upgrade — Rp 29.000/bulan"
    - Tombol X di pojok kanan atas
    - Setelah ditutup: konten tetap blur, modal hilang
- Komentar: tampilkan dari mock (buat `mockComments` minimal 3 item), nested 1 level, form komentar di bawah (hanya jika login)

**Halaman Kategori `/kategori/[slug]`**
- Header section berwarna sesuai `color_hex` kategori
- Deskripsi kategori
- Grid artikel terfilter (pakai ArticleCard variant "grid")

**Halaman Tentang `/tentang`**
- Section 1 (Hero): "Tentang tcm.my.id" + sub judul
- Section 2 (Misi): teks misi platform (buat konten yang masuk akal, ~3 paragraf)
- Section 3 (Tim): 2-3 kartu tim placeholder dengan avatar DiceBear
- Section 4 (Disclaimer Medis): box dengan warna amber-light, teks disclaimer panjang
- Tidak ada mock data khusus — konten hardcode di halaman ini

---

### C. HALAMAN AUTH

**`/daftar`**
- Form: email, username, display_name, password, confirm_password, profession (select)
- Google OAuth button (tampilan saja, belum fungsional — tampilkan toast "Segera hadir")
- Validasi sesuai rules di bagian Form Validation
- Submit (mock): delay 800ms → login otomatis sebagai `mockUsers[2]` → redirect ke /dashboard

**`/masuk`**
- Form: email, password
- Google OAuth button (tampilan saja)
- Link "Lupa password?" → `/lupa-password` (halaman placeholder simple)
- Submit (mock): delay 800ms → cek email match dengan mockUsers → login → redirect ke /dashboard
  - Email tidak ditemukan: tampilkan error "Email atau password salah"

---

### D. HALAMAN MEMBER

**Forum `/forum`**
- 4 subforum cards
- Setiap card: nama, deskripsi, badge "Free"/"Premium", thread_count, last_activity
- Subforum premium dengan badge teal "Premium": jika user free dan klik → tampilkan modal "Upgrade untuk akses forum ini"

**Subforum `/forum/[slug]`**
- Header subforum (nama + deskripsi)
- Tombol "Buat Thread Baru" (kanan atas) — link ke `/forum/[slug]/tulis` (halaman placeholder)
- List thread: sorted by is_pinned desc, lalu last_reply_at desc
- ThreadRow komponen: judul, author, reply_count, view_count, waktu terakhir reply, badge "Pinned" jika is_pinned
- Pagination 10 thread per halaman

**Detail Thread `/forum/[slug]/[id]`**
- Konten thread utama di atas (author, tanggal, isi)
- Divider "N Balasan"
- List replies: top-level replies, lalu reply yang punya parent ditampilkan indented di bawah parentnya
  - Top-level: avatar, nama, konten, waktu, upvote button, tombol "Balas"
  - Indented reply: tampil dengan border-left teal, indentasi 40px
- Tombol "Balas" di bawah setiap top-level reply: expand form Tiptap inline (bukan halaman baru)
- Form reply utama (Tiptap) di paling bawah, setelah semua replies
- Reply baru setelah submit: tambahkan ke local state, tampil di bawah list

**Dashboard `/dashboard`**
- Navbar halaman internal: tabs "Ringkasan" | "Bookmark" | "Notifikasi" | "Profil"
- URL: `/dashboard?tab=ringkasan` (tab state di URL param)

  **Tab Ringkasan:**
  - Kartu user: avatar, nama, username, badge membership_tier
  - Stats: jumlah artikel yang disukai (mock: 5), thread dibuat (mock: 2), reply dibuat (mock: 8)
  - Aktivitas terbaru: list 3 item hardcode (misal: "Menyukai artikel X", "Membalas thread Y")

  **Tab Bookmark:**
  - Grid artikel yang di-bookmark dari `mockBookmarks` (cocokkan dengan mockArticles)
  - Tombol hapus bookmark di setiap card (toggle local state)
  - Empty state jika tidak ada bookmark: ilustrasi sederhana + teks "Belum ada bookmark"

  **Tab Notifikasi:**
  - List semua notifikasi dari `mockNotifications` untuk user yang login
  - Setiap item: icon sesuai type, title, body, waktu relatif, latar putih jika sudah dibaca / latar hijau muda jika belum dibaca
  - Tombol "Tandai Semua Dibaca" (toggle local state)

  **Tab Profil:**
  - Form edit: display_name, bio, avatar_url (input URL), profession
  - Submit (mock): delay 500ms → update Zustand authStore → tampilkan toast "Profil diperbarui"

**Profil `/profil/[username]`**
- Header: avatar besar, nama, username, bio, badge profession, tanggal bergabung
- Tabs: "Artikel" | "Aktivitas Forum"
  - Tab Artikel: grid artikel yang ditulis user ini (filter mockArticles by author_id)
  - Tab Aktivitas Forum: list thread yang dibuat user ini (filter mockThreads by author_id)

---

### E. KOMPONEN SHARED WAJIB

```
/src/components/ui/
├── ArticleCard.tsx        — 2 variants: "grid" (thumbnail atas) dan "list" (thumbnail kiri)
├── PremiumGate.tsx        — modal non-fullscreen dengan tombol X
├── TranslateToggle.tsx    — pill toggle ID|EN, state di URL param
├── MemberBadge.tsx        — free | premium | praktisi | moderator | admin
├── CategoryBadge.tsx      — dot berwarna + label, warna dari color_hex
├── ThreadRow.tsx          — row thread: judul, meta, stats, badge pinned
├── ReplyItem.tsx          — single reply dengan upvote + tombol balas
├── SkeletonCard.tsx       — loading state artikel (animate-pulse)
├── SkeletonRow.tsx        — loading state thread (animate-pulse)
├── ErrorState.tsx         — 404 dan error umum dengan tombol retry/back
├── Toast.tsx              — notifikasi singkat muncul di pojok kanan bawah
└── Modal.tsx              — wrapper modal reusable dengan backdrop + close
```

---

## BEHAVIOR RULES

**Translate Toggle:**
- Simpan preferensi bahasa di URL param `?lang=en` agar URL shareable
- Klik EN → skeleton loading 1.5 detik → tampilkan `content_en`
- Jika `content_en === null` → setelah 1.5 detik tampilkan: "Terjemahan belum tersedia untuk artikel ini."
- Klik ID → langsung ganti tanpa delay

**Premium Gate — aturan yang tidak boleh pushy:**
- Tampilkan 300 kata pertama artikel (hitung kata, bukan karakter)
- Gradient fade: `bg-gradient-to-b from-transparent to-white` pada div terakhir yang terlihat
- Modal muncul otomatis 1 detik setelah halaman dimuat (bukan langsung)
- Setelah modal ditutup: modal hilang, blur tetap ada, tidak muncul lagi dalam sesi yang sama (simpan di sessionStorage)

**Animasi Counter Statistik:**
- Implementasi dengan `useEffect` + `requestAnimationFrame` — tidak perlu library
- Durasi animasi: 1500ms
- Trigger: hanya saat section masuk viewport (`IntersectionObserver`)
- Easing: ease-out (mulai cepat, lambat di akhir)

**Error Boundary:**
- Buat `/src/app/error.tsx` (Next.js error boundary)
- Tampilkan komponen `ErrorState` dengan tombol "Coba lagi"
- Buat `/src/app/not-found.tsx` dengan pesan 404 dan link kembali ke beranda

**Loading States:**
- Gunakan `loading.tsx` di setiap route segment (Next.js convention)
- Artikel list: 9 SkeletonCard (sesuai per_page)
- Thread list: 5 SkeletonRow
- Detail artikel: skeleton untuk hero + 3 paragraf + sidebar

---

## URUTAN BUILD

```
1.  git init + buat AGENTS.md
2.  npx create-next-app@14.2.20 . --typescript --tailwind --app
3.  Install dependencies sesuai daftar (TANPA next-auth)
4.  Setup tailwind.config.ts dengan custom colors + fonts
5.  Setup globals.css dengan CSS variables
6.  Buat SEMUA file mock data di /src/mock/ (termasuk notifications, bookmarks, replies)
7.  Buat Zustand authStore (/src/store/authStore.ts) sesuai spec di atas
8.  Setup React Query: queryClient.ts + queryKeys.ts + wrap di layout.tsx
9.  Buat shared UI components: ErrorState, Toast, Modal, SkeletonCard, SkeletonRow
10. Buat layout components: Navbar (dengan notifikasi bell) + Footer
11. Buat ArticleCard (grid + list variant), CategoryBadge, MemberBadge, ThreadRow
12. Build halaman Beranda (/) dengan animasi counter
13. Build halaman Daftar Artikel + toggle grid/list
14. Build halaman Detail Artikel + premium gate + translate toggle + komentar
15. Build halaman Kategori
16. Build halaman Forum + Subforum + Detail Thread (dengan Tiptap reply)
17. Build halaman Auth: /daftar + /masuk + /lupa-password (placeholder)
18. Build halaman Tulis Artikel /artikel/tulis (Tiptap editor)
19. Build Dashboard /dashboard (4 tabs)
20. Build Profil /profil/[username]
21. Build halaman Tentang /tentang
22. Buat error.tsx dan not-found.tsx
23. Buat loading.tsx di setiap route segment
24. Cek responsif di 375px (mobile) dan 768px (tablet)
25. Final polish: hover transitions, focus states, toast notifications
```

---

## CATATAN UNTUK CODEX

- Bahasa Indonesia untuk semua konten UI dan teks
- Jangan pakai shadcn, MUI, Chakra, next-auth, atau component library lain
- Setiap halaman wajib punya `export const metadata` dengan title + description
- Gunakan `next/image` untuk semua gambar (thumbnail, avatar)
- Avatar dari DiceBear, thumbnail dari Unsplash (URL langsung)
- Target: jalan sempurna di localhost:3000
- TypeScript strict: tidak perlu `strict: true` tapi hindari `any` kecuali terpaksa

---

## DELIVERABLE

1. localhost:3000 → beranda tampil indah dengan animasi counter
2. Browse dan filter artikel — toggle grid/list berfungsi
3. Klik artikel premium → premium gate muncul 1 detik kemudian, bisa ditutup
4. Toggle ID/EN → terjemahan simulasi berjalan, null ditangani dengan pesan
5. Browse forum, buka thread, lihat replies nested 1 level, balas dengan Tiptap
6. Demo login → akses berubah sesuai tier, notifikasi bell menampilkan unread count
7. Dashboard: 4 tabs berfungsi (ringkasan, bookmark, notifikasi, profil edit)
8. Semua halaman responsif di mobile 375px
9. Loading skeleton dan error state (error.tsx, not-found.tsx) berfungsi
10. /tentang dan /artikel/tulis ada dan bisa diakses

BRIEF END.
