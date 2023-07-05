const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		home: {
			import: './src/pages/home/index.ts',
		},
		project: {
			import: './src/pages/project/index.ts',
		},
	},
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{ // CSS
				test: /\.(scss|css)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: 'postcss-loader',
					},
				]
			},
			{ // Typescript
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
		]
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: './src/pages/template.html',
			filename: path.resolve(__dirname, 'dist/index.html'),
			chunks: ['home'],
			title: 'StoryBread - Home',
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/template.html',
			filename: path.resolve(__dirname, 'dist/project.html'),
			chunks: ['project'],
			title: 'StoryBread - Project',
		}),
	]
}
