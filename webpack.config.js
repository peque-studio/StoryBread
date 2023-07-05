const path = require('path');

module.exports = {
	entry: {
		main: {
			import: './src/home/index.js',
		},
		project: {
			import: './src/project/index.ts',
		},
	},
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{ // PostCSS
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'style-loader',
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
}
