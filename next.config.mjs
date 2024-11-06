/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Get basePath from environment variable or default to '/board_photoshoot'
  basePath: process.env.NODE_ENV === 'production' ? '/board_photoshoot' : '',
  images: {
    unoptimized: true,
  },
  // This ensures assets are served correctly on GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/board_photoshoot' : '',
};

export default nextConfig;
