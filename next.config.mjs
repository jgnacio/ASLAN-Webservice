/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "via.placeholder.com",
          },
          {
            protocol: "https",
            hostname: "assets.apidog.com/app/project-icon/custom/*",
          }
        ],
      },
};

export default nextConfig;
