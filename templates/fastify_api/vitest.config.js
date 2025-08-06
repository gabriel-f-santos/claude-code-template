/**
 * ⚡ Vitest Configuration for Fastify Vibecoding
 * 
 * Fast test setup perfect for TDD and vibecoding sessions.
 * Optimized for rapid feedback and development cycles.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use globals so we don't need to import test functions
    globals: true,
    
    // Test environment
    environment: 'node',
    
    // Test files pattern
    include: ['tests/**/*.test.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'coverage/',
        'vitest.config.js',
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
      exclude: ['node_modules/**', 'coverage/**']
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
  }
});