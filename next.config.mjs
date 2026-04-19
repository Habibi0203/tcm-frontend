/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hindari image optimization server-side untuk host eksternal.
    // Sebelumnya fallback avatar Dicebear bisa timeout lalu menjatuhkan route ke error boundary.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },

  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:3001";
    // afterFiles: Next.js checks its own API routes first.
    // /api/email/send matches src/app/api/email/send/route.ts → never hits these rewrites.
    return {
      afterFiles: [
        { source: "/api/auth/:path*",      destination: `${backend}/api/auth/:path*` },
        { source: "/api/articles/:path*",  destination: `${backend}/api/articles/:path*` },
        { source: "/api/subforums/:path*", destination: `${backend}/api/subforums/:path*` },
        { source: "/api/threads/:path*",   destination: `${backend}/api/threads/:path*` },
        { source: "/api/replies/:path*",   destination: `${backend}/api/replies/:path*` },
        { source: "/api/users/:path*",     destination: `${backend}/api/users/:path*` },
        { source: "/api/admin/:path*",     destination: `${backend}/api/admin/:path*` },
        { source: "/api/agent/:path*",     destination: `${backend}/api/agent/:path*` },
        { source: "/api/health",           destination: `${backend}/api/health` },
      ],
    };
  },
};

export default nextConfig;
