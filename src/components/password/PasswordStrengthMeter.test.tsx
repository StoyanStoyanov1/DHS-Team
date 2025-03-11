import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  test('renders with very weak strength (red)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={0} />);
    const strengthBar = container.querySelector('div.bg-red-500');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '0%' });
  });

  test('renders with weak strength (orange)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={1} />);
    const strengthBar = container.querySelector('div.bg-orange-500');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '20%' });
  });

  test('renders with average strength (yellow)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={2} />);
    const strengthBar = container.querySelector('div.bg-yellow-500');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '40%' });
  });

  test('renders with strong strength (blue)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={3} />);
    const strengthBar = container.querySelector('div.bg-blue-500');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '60%' });
  });

  test('renders with very strong strength (green)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={4} />);
    const strengthBar = container.querySelector('div.bg-green-500');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '80%' });
  });

  test('renders with maximum strength (dark green)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={5} />);
    const strengthBar = container.querySelector('div.bg-green-800');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveStyle({ width: '100%' });
  });
}); 