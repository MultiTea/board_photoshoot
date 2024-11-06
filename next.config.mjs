/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for GitHub Pages
  basePath: '/board_photoshoot', // Replace with your actual repository name
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
