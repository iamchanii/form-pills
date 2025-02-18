import { defineConfig } from 'tsdown/config';

export default defineConfig({
	entry: ['./src/index.tsx'],
	format: 'esm',
	target: 'node16',
	clean: true,
	platform: 'browser',
	skipNodeModulesBundle: true,
	dts: { transformer: 'oxc' },
	bundleDts: true,
	unused: { level: 'error' },
	publint: true,
	sourcemap: true,
	minify: true,
	onSuccess() {
		console.info('🙏 Build succeeded!');
	},
});
