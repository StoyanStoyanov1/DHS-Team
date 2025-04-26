// За импортиране на екстеншъните на jest-dom
import '@testing-library/jest-dom';

// Глобални мокове или настройки
// Пример: глобални мокове на Next.js функции
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
  }),
}));

// Потискане на console.error и console.warn в тестовете
// за по-чисти тестови резултати
global.console = {
  ...console,
  // Не искаме конзолни грешки или предупреждения в тестовете
  error: jest.fn(),
  warn: jest.fn(),
  // Запазваме оригиналния log
  log: console.log,
  info: console.info,
  debug: console.debug,
};