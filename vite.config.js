import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: "/",
    server: {
      host: true,     // 👈 tillad adgang udefra (viser din lokale IP)
      port: 5173,     
    },
  };

  // Change base path when building for production
  if (command !== "serve") {
    config.base = "/web-app/"; // 👈 Replace with your GitHub repository name
  }

  return config;
});
