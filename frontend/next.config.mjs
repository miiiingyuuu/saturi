/** @type {import('next').NextConfig} */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: false,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,
          },
        },
      ],
    });

    return config;
  },
  // 업로드 하는 파일 크기 제한을 1mb 에서 2mb 로 확장
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // 서버 액션에서 사용될 본문 크기 제한
    },
  },
};

export default nextConfig;

// 원문
// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
