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
          },
          {
            protocol: "https",
            hostname: "pcservice.com.uy*",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com/*"
          }
        ],
      },
};

export default nextConfig;
