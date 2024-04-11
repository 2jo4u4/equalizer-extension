import path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
  mode: "production",
  entry: {
    pop: path.resolve(__dirname, "src/pop/index.ts"),
    background: path.resolve(__dirname, "src/background/index.ts"),
    content: path.resolve(__dirname, "src/content/index.ts"),
    customTag: path.resolve(__dirname, "src/pop/customTag.ts"),
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "extensions" },
        { from: "node_modules/webextension-polyfill/dist/browser-polyfill.js" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

export default config;
