// jest.setup.js
import '@testing-library/jest-dom';

jest.mock('@/utils/translate/authTranslate', () => ({
  __esModule: true,
}));

