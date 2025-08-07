/**
 * ⚡ Vitest Configuration for Fastify TypeScript Vibecoding
 * 
 * Fast test setup with TypeScript support perfect for TDD and vibecoding sessions.
 * Optimized for rapid feedback and development cycles.
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Use globals so we don't need to import test functions
    globals: true,
    
    // Test environment
    environment: 'node',
    
    // Test files pattern
    include: ['tests/**/*.test.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'coverage/',
        'dist/',
        'vitest.config.ts',
        'prisma/',
        '**/*.d.ts'
      ]
    },
    
    // Test timeout (useful for database operations)
    testTimeout: 10000,
    
    // Setup files (run before each test file)
    setupFiles: [],
    
    // Global setup (run once before all tests)
    globalSetup: [],
    
    // Watch configuration for vibecoding sessions
    watch: {
      include: ['src/**', 'tests/**'],
      exclude: ['node_modules/**', 'coverage/**', 'dist/**']
    },
    
    // Reporter configuration
    reporter: process.env.CI ? 'junit' : 'verbose',
    
    // Parallel test execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  },
  
  // Path resolution for TypeScript imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/services': resolve(__dirname, './src/services'),
      '@/controllers': resolve(__dirname, './src/controllers'),
      '@/routes': resolve(__dirname, './src/routes'),
      '@/schemas': resolve(__dirname, './src/schemas'),
      '@/plugins': resolve(__dirname, './src/plugins')
    }
  }
});