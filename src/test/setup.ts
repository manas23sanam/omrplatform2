import '@testing-library/jest-dom';

// Polyfill localStorage for JSDOM / Node environment
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
};

if (typeof window !== 'undefined') {
  const storage = window.localStorage && typeof window.localStorage.clear === 'function' 
    ? window.localStorage 
    : createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', { value: storage, writable: true });
  (globalThis as any).localStorage = storage;
} else {
  (globalThis as any).localStorage = createLocalStorageMock();
}

// Polyfill window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill scrollTo
window.scrollTo = (() => {}) as any;

// Mock window.URL.createObjectURL and revokeObjectURL
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = () => 'blob:mock-url';
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = () => {};
}

// Mock Recharts ResponsiveContainer for reliable JSDOM rendering
import { vi } from 'vitest';
import React from 'react';

vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children, width = 500, height = 300 }: any) => {
      return React.createElement(
        'div',
        {
          className: 'recharts-responsive-container',
          style: { width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height },
          'data-testid': 'responsive-container',
        },
        children
      );
    },
  };
});

