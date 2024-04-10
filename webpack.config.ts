import path from "path";
import webpack from "webpack";
import CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
    mode: "production",
    entry: {
        pop: path.resolve(__dirname, "src/pop.ts"),
        background: path.resolve(__dirname, "src/background.ts"),
        content: path.resolve(__dirname, "src/content.ts"),
        customTag: path.resolve(__dirname, "src/customTag.ts")
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "extensions" }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },

};

export default config;
