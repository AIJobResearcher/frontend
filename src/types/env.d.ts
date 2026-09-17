/**
 * Build-time globals injected by webpack `DefinePlugin` and the Vitest
 * `define` block. Single source of truth for `API_BASE_URL`, which is
 * resolved from `VITE_API_URL` in `webpack.config.ts`.
 */
declare const API_BASE_URL: string;
