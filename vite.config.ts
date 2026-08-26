import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const mesaAyudaProxyTarget = env.VITE_MESA_AYUDA_API_PROXY_TARGET ?? "http://127.0.0.1:8001";

  const mesaApiProxy = {
    target: mesaAyudaProxyTarget,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/mesa-api/, ""),
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/mesa-api": mesaApiProxy,
      },
    },
    preview: {
      port: 4173,
      proxy: {
        "/mesa-api": mesaApiProxy,
      },
    },
  };
});
