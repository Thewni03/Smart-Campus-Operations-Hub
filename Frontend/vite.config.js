import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const popupFriendlyHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: popupFriendlyHeaders,
  },
  preview: {
    headers: popupFriendlyHeaders,
  },
})
