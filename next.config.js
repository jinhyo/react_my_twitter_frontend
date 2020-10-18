// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true"
// });

module.exports = {
  compress: true, // 압축(compress plugin 설치 하는대신 이렇게 사용)

  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";

    const newConfig = {
      ...config,
      mode: prod ? "production" : "development",
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)
      ]
    };

    if (prod) {
      newConfig.devtool = "hidden-source-map";
    }

    return newConfig;
  }
};
