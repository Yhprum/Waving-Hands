import { sveltekit } from "@sveltejs/kit/vite";
import preprocess from "svelte-preprocess";

const config = {
	plugins: [
		sveltekit(),
	],
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
