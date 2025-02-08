const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Точка входа
    output: {
        path: path.resolve(__dirname, "dist"), // Папка для скомпилированных файлов
        filename: "bundle.js", // Имя выходного файла
        clean: true, // Очистка старых файлов при новой сборке
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Обработка JavaScript и JSX
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/, // Обработка CSS
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html", // Шаблон HTML
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        port: 8080,
        open: true, // Автоматическое открытие браузера
        hot: true, // Горячая перезагрузка
    },
    resolve: {
        extensions: [".js", ".jsx"], // Разрешение расширений
    },
};