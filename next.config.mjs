/** @type {import('next').NextConfig} */
const nextConfig = {
  // Load the Google Fonts <link> at runtime (same as the original static site)
  // instead of Next fetching/inlining it at build time. Keeps builds clean and
  // network-independent.
  optimizeFonts: false,

  // Preserve old static URLs so existing links / bookmarks keep working.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/talent.html", destination: "/talent", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/odiseus-cloud.html", destination: "/odiseus-cloud", permanent: true },
    ];
  },
};

export default nextConfig;
