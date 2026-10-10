import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/quantum-machine-learning-playground/',
  test: { include: ['tests/unit/**/*.test.ts'] },
});
