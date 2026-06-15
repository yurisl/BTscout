import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@beach-tennis-scout/domain'],
  webpack(webpackConfig) {
    // TypeScript ESM packages use `.js` extensions in imports; tell webpack
    // to also try `.ts`/`.tsx` when resolving those.
    webpackConfig.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
};

export default config;
