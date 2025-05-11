import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
	const isDev = mode !== 'production';

	return {
		resolve: {
			alias: {
				'react-is': path.resolve(__dirname, 'node_modules/react-is'),
				'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
			},
		},
		plugins: [
			react({
				jsxRuntime: 'automatic',
				babel: {
					plugins: isDev
						? [
								[
									'check-prop-types',
									{
										verbose: true,
										disableWhenNODE_ENV: false,
									},
								],
							]
						: [],
				},
			}),
		],
	};
});
