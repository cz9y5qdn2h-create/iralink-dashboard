/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://nqboedyhlmyxyefjkshg.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYm9lZHlobG15eHllZmprc2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjM0ODEsImV4cCI6MjA5MDQ5OTQ4MX0.qp8IjE9-MRZFKviebneQU6rLP_PRp3ma673HBpTUDf4",
    NEXT_PUBLIC_APP_URL: "https://iralink-dashboard.vercel.app",
  },
};

export default nextConfig;
