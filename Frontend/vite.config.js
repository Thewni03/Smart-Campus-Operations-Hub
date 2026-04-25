import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const popupFriendlyHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: popupFriendlyHeaders,
  },
  preview: {
    headers: popupFriendlyHeaders,
  },
})
