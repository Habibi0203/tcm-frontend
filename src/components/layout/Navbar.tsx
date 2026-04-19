"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Bell } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { mockNotifications } from "@/mock/notifications";
import ThemeToggle from "@/components/ui/ThemeToggle";

function relativeTime(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  return `${months} bulan lalu`;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(target))  setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLinks = [
    { href: "/",       label: "Beranda" },
    { href: "/artikel", label: "Artikel" },
    { href: "/forum",   label: "Forum"   },
    { href: "/tentang", label: "Tentang" },
  ];

  const myNotifs    = user ? mockNotifications.filter((n) => n.user_id === user.id) : [];
  const unreadCount = myNotifs.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-40 bg-bark shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-chinese text-xl text-white">
              道
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-wide text-sand">tcm.my.id</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-clay">Komunitas TCM</span>
            </div>
          </Link>
        </div>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-1.5 text-sm tracking-wide text-sand/80 transition-colors hover:bg-bark-light hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Link href="/masuk" className="text-sm text-sand/70 hover:text-sand">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Bergabung
              </Link>
            </>
          ) : (
            <>
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative rounded-full p-2 text-sand/70 hover:bg-bark-light hover:text-sand"
                  aria-label="Notifikasi"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border-main bg-card shadow-xl">
                    <div className="flex items-center justify-between border-b border-border-main px-4 py-3">
                      <span className="text-sm font-semibold text-text-main">Notifikasi</span>
                      <button className="text-xs text-primary hover:text-primary-dark">
                        Tandai semua dibaca
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {myNotifs.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted">
                          Belum ada notifikasi
                        </div>
                      ) : (
                        myNotifs.slice(0, 5).map((n) => (
                          <Link
                            key={n.id}
                            href={n.link || "#"}
                            onClick={() => setNotifOpen(false)}
                            className={`block border-b border-border-main px-4 py-3 text-sm last:border-b-0 hover:bg-surface ${
                              !n.is_read ? "bg-primary-light/40" : ""
                            }`}
                          >
                            <div className={`${!n.is_read ? "font-semibold" : "font-medium"} text-text-main`}>
                              {n.title}
                            </div>
                            <div className="mt-0.5 line-clamp-1 text-xs text-muted">{n.body}</div>
                            <div className="mt-1 text-[11px] text-muted">{relativeTime(n.created_at)}</div>
                          </Link>
                        ))
                      )}
                    </div>
                    <Link
                      href="/dashboard?tab=notifikasi"
                      onClick={() => setNotifOpen(false)}
                      className="block border-t border-border-main px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-surface"
                    >
                      Lihat semua notifikasi
                    </Link>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-bark-light bg-bark-light/60 py-1 pl-1 pr-3 hover:bg-bark-light"
                >
                  <Image
                    src={user!.avatar_url}
                    alt={user!.display_name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-sand">{user!.display_name}</span>
                  <ChevronDown size={14} className="text-clay" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-border-main bg-card shadow-xl">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-main hover:bg-surface"
                    >
                      <LayoutDashboard size={16} className="text-primary" /> Dashboard
                    </Link>
                    <Link
                      href={`/profil/${user!.username}`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-main hover:bg-surface"
                    >
                      <User size={16} className="text-muted" /> Profil
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 border-t border-border-main px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Mobile menu button ── */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-sand/70 hover:bg-bark-light hover:text-sand md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Nav ── */}
      {mobileOpen && (
        <div className="border-t border-bark-light bg-bark-light px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-sand/80 hover:bg-bark hover:text-gold-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-bark pt-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/masuk"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-bark px-3 py-2 text-center text-sm font-medium text-sand"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Bergabung
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-bark px-3 py-2 text-sm text-sand">
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="rounded-lg border border-red-900/40 px-3 py-2 text-left text-sm text-red-400"
                >
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
