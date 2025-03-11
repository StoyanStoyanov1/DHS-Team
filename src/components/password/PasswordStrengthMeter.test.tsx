import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  test('does not render when password is empty', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={0} password="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders with very weak strength (red)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={0} password="test" />);
    const strengthBar = container.querySelector('.from-red-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[20%]');
    expect(screen.getByText('Много слаба')).toBeInTheDocument();
    expect(screen.getByText('Много слаба')).toHaveClass('text-red-500');
  });

  test('renders with weak strength (orange)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={1} password="test123" />);
    const strengthBar = container.querySelector('.from-orange-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[40%]');
    expect(screen.getByText('Слаба')).toBeInTheDocument();
    expect(screen.getByText('Слаба')).toHaveClass('text-red-500');
  });

  test('renders with average strength (yellow)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={2} password="Test123" />);
    const strengthBar = container.querySelector('.from-yellow-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[60%]');
    expect(screen.getByText('Средна')).toBeInTheDocument();
    expect(screen.getByText('Средна')).toHaveClass('text-yellow-600');
  });

  test('renders with strong strength (blue)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={3} password="Test123!" />);
    const strengthBar = container.querySelector('.from-blue-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[80%]');
    expect(screen.getByText('Силна')).toBeInTheDocument();
    expect(screen.getByText('Силна')).toHaveClass('text-blue-600');
  });

  test('renders with very strong strength (green)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={4} password="Test123!@" />);
    const strengthBar = container.querySelector('.from-green-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[100%]');
    expect(screen.getByText('Много силна')).toBeInTheDocument();
    expect(screen.getByText('Много силна')).toHaveClass('text-green-600');
  });

  test('renders with maximum strength (dark green)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={5} password="Test123!@#" />);
    const strengthBar = container.querySelector('.from-green-400');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[100%]');
    expect(screen.getByText('Отлична')).toBeInTheDocument();
    expect(screen.getByText('Отлична')).toHaveClass('text-green-600');
  });
}); 