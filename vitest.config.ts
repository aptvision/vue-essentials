/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true, // Umożliwia używanie globalnych funkcji testowych (describe, it, expect)
    environment: 'jsdom', // Możesz użyć 'node' lub 'jsdom' w zależności od potrzeb
    coverage: {
      reporter: ['text', 'json', 'html'], // Opcjonalne raportowanie pokrycia kodu
    },
  },
});