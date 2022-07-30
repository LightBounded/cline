import adapter from '@sveltejs/adapter-auto';
import { resolve } from "path";
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		vite: {
			resolve: {
				alias: {
					"src": resolve("./src")
				},
			},
		},
		adapter: adapter()
	},
};

export default config;
