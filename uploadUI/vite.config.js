import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/uploadFile": "http://localhost:5000",
    },
  },
  plugins: [react()],
});
