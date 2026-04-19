/**
 * Seed accounts for development / staging.
 * Production credentials are set via backend seeding — never hardcode real passwords here.
 *
 * DEFAULT SEED CREDENTIALS (dev only):
 * ┌─────────────┬─────────────────────────┬──────────────────┬─────────────┐
 * │ Role        │ Email                   │ Password (seed)  │ Tier        │
 * ├─────────────┼─────────────────────────┼──────────────────┼─────────────┤
 * │ user        │ user@tcm.my.id          │ User@tcm2026     │ free        │
 * │ moderator   │ moderator@tcm.my.id     │ Mod@tcm2026      │ premium     │
 * │ admin       │ admin@tcm.my.id         │ Admin@tcm2026    │ premium     │
 * │ superadmin  │ superadmin@tcm.my.id    │ SuperAdmin@2026! │ premium     │
 * └─────────────┴─────────────────────────┴──────────────────┴─────────────┘
 */

export type UserRole       = "superadmin" | "admin" | "moderator" | "member" | "agent";
export type MembershipTier = "free" | "premium";
export type Profession     = "general" | "practitioner" | "student";

export interface MockUser {
  id:               string;
  email:            string;
  username:         string;
  display_name:     string;
  avatar_url:       string;
  bio:              string;
  profession:       Profession;
  role:             UserRole;
  membership_tier:  MembershipTier;
  is_verified:      boolean;
  is_active:        boolean;
  created_at:       string;
}

export const mockUsers: MockUser[] = [
  // ── 1. Regular User ──────────────────────────────────────────────────────
  {
    id:              "usr_001",
    email:           "user@tcm.my.id",
    username:        "member_tcm",
    display_name:    "Member TCM",
    avatar_url:      "https://api.dicebear.com/7.x/initials/svg?seed=MemberTCM&backgroundColor=534AB7",
    bio:             "Member komunitas tcm.my.id.",
    profession:      "general",
    role:            "member",
    membership_tier: "free",
    is_verified:     true,
    is_active:       true,
    created_at:      "2026-01-01T00:00:00Z",
  },

  // ── 2. Moderator ─────────────────────────────────────────────────────────
  {
    id:              "usr_002",
    email:           "moderator@tcm.my.id",
    username:        "moderator_tcm",
    display_name:    "Moderator TCM",
    avatar_url:      "https://api.dicebear.com/7.x/initials/svg?seed=ModeratorTCM&backgroundColor=0C447C",
    bio:             "Moderator komunitas tcm.my.id. Menjaga diskusi tetap sehat dan informatif.",
    profession:      "practitioner",
    role:            "moderator",
    membership_tier: "premium",
    is_verified:     true,
    is_active:       true,
    created_at:      "2026-01-01T00:00:00Z",
  },

  // ── 3. Admin ──────────────────────────────────────────────────────────────
  {
    id:              "usr_003",
    email:           "admin@tcm.my.id",
    username:        "admin_tcm",
    display_name:    "Admin TCM",
    avatar_url:      "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75",
    bio:             "Administrator tcm.my.id — mengelola konten, artikel, dan forum komunitas.",
    profession:      "practitioner",
    role:            "admin",
    membership_tier: "premium",
    is_verified:     true,
    is_active:       true,
    created_at:      "2026-01-01T00:00:00Z",
  },

  // ── 4. Super Admin ────────────────────────────────────────────────────────
  {
    id:              "usr_004",
    email:           "superadmin@tcm.my.id",
    username:        "superadmin_tcm",
    display_name:    "Super Admin",
    avatar_url:      "https://api.dicebear.com/7.x/initials/svg?seed=SuperAdmin&backgroundColor=8b2020",
    bio:             "Super Administrator tcm.my.id — akses penuh ke seluruh sistem.",
    profession:      "general",
    role:            "superadmin",
    membership_tier: "premium",
    is_verified:     true,
    is_active:       true,
    created_at:      "2026-01-01T00:00:00Z",
  },
];

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getUserByUsername(username: string): MockUser | undefined {
  return mockUsers.find((u) => u.username === username);
}

export function getUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email === email);
}
