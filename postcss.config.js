/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		require('autoprefixer'),
		require('postcss-nested'),
		// require('postcss-preset-env'),
		require('cssnano')({
			preset: 'default',
		}),
		// require('postcss-custom-properties')({

		// })
	],
}

module.exports = config
