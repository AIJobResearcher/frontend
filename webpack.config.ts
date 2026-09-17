import fs from 'fs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}

interface WebpackArgv {
  mode?: string;
}

type Mode = 'development' | 'production';

/** Used when no `.env*` file and no real environment variable provides VITE_API_URL */
const FALLBACK_API_URL = 'http://localhost:8001/api/v1';

/**
 * Minimal dotenv parser (same semantics for the files used in this project).
 * Kept dependency-free so that env loading also works in offline/CI installs.
 */
const parseEnvFile = (contents: string): Record<string, string> => {
  const parsed: Record<string, string> = {};

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed
      .slice(0, separatorIndex)
      .trim()
      .replace(/^export\s+/, '');
    if (!key) continue;

    let value = trimmed.slice(separatorIndex + 1).trim();
    const isQuoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (isQuoted && value.length >= 2) value = value.slice(1, -1);

    parsed[key] = value;
  }

  return parsed;
};

/**
 * Reads `.env` files with Vite-compatible precedence:
 * `.env` < `.env.local` < `.env.<mode>` < `.env.<mode>.local`.
 * Real process environment variables always take precedence over files.
 *
 * @returns resolved variables plus the file that provided (or overrode) each key
 */
const loadEnv = (
  mode: Mode
): { values: Record<string, string>; sources: Record<string, string> } => {
  const files = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
  const values: Record<string, string> = {};
  const sources: Record<string, string> = {};

  for (const file of files) {
    const filePath = path.resolve(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    const parsed = parseEnvFile(fs.readFileSync(filePath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] !== undefined) continue; // real env wins
      values[key] = value;
      sources[key] = file;
    }
  }

  return { values, sources };
};

const resolveMode = (argv: WebpackArgv): Mode => {
  const mode = argv?.mode || process.env.NODE_ENV;
  return mode === 'production' ? 'production' : 'development';
};

export default (_env: unknown, argv: WebpackArgv = {}): Configuration => {
  const mode = resolveMode(argv);
  const isDevelopment = mode === 'development';
  const isProduction = !isDevelopment;

  const { values: envValues, sources: envSources } = loadEnv(mode);
  const apiBaseUrl = process.env.VITE_API_URL ?? envValues.VITE_API_URL ?? FALLBACK_API_URL;
  const apiBaseUrlSource = process.env.VITE_API_URL
    ? 'process.env'
    : (envSources.VITE_API_URL ?? 'fallback');

  // eslint-disable-next-line no-console -- surfaces the effective API URL in build/dev output
  console.log(`[webpack] mode=${mode} API_BASE_URL=${apiBaseUrl} (from ${apiBaseUrlSource})`);

  const config: Configuration = {
    mode,
    devtool: isDevelopment ? 'source-map' : 'source-map',
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        // TypeScript/JSX
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        // CSS
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['@tailwindcss/postcss'], 'autoprefixer'],
                },
              },
            },
          ],
        },
        // Images and fonts
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        minify: isProduction && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new webpack.DefinePlugin({
        // `process.env.NODE_ENV` is set by webpack itself via `mode`/`optimization.nodeEnv`
        API_BASE_URL: JSON.stringify(apiBaseUrl),
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css',
        }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: isProduction
        ? [
            new TerserPlugin({
              terserOptions: {
                parse: { ecma: 2020 },
                compress: { ecma: 2020 },
                output: { ecma: 2020, comments: false },
              },
              extractComments: false,
            }),
            new CssMinimizerPlugin(),
          ]
        : [],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'react-vendors',
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            name: 'common',
          },
        },
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    devServer: {
      port: 3005,
      host: 'localhost',
      historyApiFallback: true,
      hot: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      proxy: [
        {
          context: ['/api'],
          target: apiBaseUrl,
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
        },
      ],
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };

  return config;
};
