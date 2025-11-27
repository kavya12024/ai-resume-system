import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",               // React entry
        dashboard: "public/dashboard.html",
        upload: "public/upload.html",
        interview: "public/interview.html"
      }
    }
  }
})
