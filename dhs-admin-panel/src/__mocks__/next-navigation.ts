export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
}));

export const usePathname = jest.fn(() => '/');

export const useSearchParams = jest.fn(() => ({
  get: jest.fn((key) => null),
  getAll: jest.fn(() => []),
  has: jest.fn(() => false),
  forEach: jest.fn(),
  entries: jest.fn(() => ({
    next: jest.fn(() => ({ done: true })),
    [Symbol.iterator]: jest.fn(),
  })),
  values: jest.fn(() => ({
    next: jest.fn(() => ({ done: true })),
    [Symbol.iterator]: jest.fn(),
  })),
  keys: jest.fn(() => ({
    next: jest.fn(() => ({ done: true })),
    [Symbol.iterator]: jest.fn(),
  })),
  toString: jest.fn(() => ''),
  [Symbol.iterator]: jest.fn(),
  size: 0,
}));