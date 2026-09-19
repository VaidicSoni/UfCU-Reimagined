import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // '::' binds dual-stack, so both http://localhost and http://127.0.0.1
    // work. Binding the default 'localhost' can resolve to IPv6 only on macOS,
    // which leaves 127.0.0.1 refusing connections.
    host: '::',
    port: 5173,
    // Fail loudly instead of silently moving to 5174 and breaking the URL
    // everyone on the team has open.
    strictPort: true,
    open: true,
  },
})
