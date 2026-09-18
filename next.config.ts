import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

/** Must match the fallback in `src/shared/config/env.ts`. */
const DEFAULT_API_URL = 'http://localhost:8001/api/v1';

const apiOrigins = [
  ...new Set(
    [
      process.env.NEXT_PUBLIC_VACANCIES_MARKET_API_URL || DEFAULT_API_URL,
      process.env.NEXT_PUBLIC_RESEARCHER_CRM_API_URL || DEFAULT_API_URL,
    ].map((url) => new URL(url).origin)
  ),
].join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigins}`,
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vacancies-market',
        permanent: false,
      },
    ];
  },
  // TODO(2.6): add `images.remotePatterns` for `Employer.logo_url` and
  // `Interviewer.avatar_url` once the media host is known. The OpenAPI spec
  // describes them as server paths now and S3 later.
};

export default withNextIntl(nextConfig);
