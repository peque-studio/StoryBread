module.exports = {
	entry: ['./src/index.ts'],
	output: { filename: './dist/bundle.js', },
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
						loader: 'postcss-loader'
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
	mode: 'development'
}
