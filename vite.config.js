import { sveltekit } from "@sveltejs/kit/vite";
import injectSocketIO from "./socketio-server";
import preprocess from "svelte-preprocess";

const config = {
  plugins: [
    sveltekit(),
    {
      name: "sveltekit-socket-io",
      configureServer(server) {
        injectSocketIO(server.httpServer);
      },
    },
  ],
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
