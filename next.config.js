/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // ESLintのチェックをスキップ
  eslint: {
    // 本番ビルド時にESLintのエラーを無視する
    ignoreDuringBuilds: true,
  },
  // TypeScriptの型チェックをスキップ
  typescript: {
    // 本番ビルド時にTypeScriptのエラーを無視する
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig; 