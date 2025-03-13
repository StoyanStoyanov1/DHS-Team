import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  test('renders with very weak strength (red)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={1} password="test" text="Very weak" />);
    const strengthBar = container.querySelector('.from-red-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[20%]');
    expect(screen.getByText('Very weak')).toBeInTheDocument();
    expect(screen.getByText('Very weak')).toHaveClass('text-red-500');
  });

  test('renders with weak strength (orange)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={2} password="test123" text="Weak"/>);
    const strengthBar = container.querySelector('.from-orange-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[40%]');
    expect(screen.getByText('Weak')).toBeInTheDocument();
    expect(screen.getByText('Weak')).toHaveClass('text-red-500');
  });

  test('renders with average strength (yellow)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={3} password="Test123" text="Average"/>);
    const strengthBar = container.querySelector('.from-yellow-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[60%]');
    expect(screen.getByText('Average')).toBeInTheDocument();
    expect(screen.getByText('Average')).toHaveClass('text-yellow-600');
  });

  test('renders with strong strength (blue)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={4} password="Test123!" text="Strong" />);
    const strengthBar = container.querySelector('.from-blue-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[80%]');
    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByText('Strong')).toHaveClass('text-blue-600');
  });

  test('renders with very strong strength (green)', () => {
    const { container } = render(<PasswordStrengthMeter passwordStrengthValue={5} password="Test123!@" text="Very strong" />);
    const strengthBar = container.querySelector('.from-green-200');
    expect(strengthBar).toBeInTheDocument();
    expect(strengthBar).toHaveClass('w-[100%]');
    expect(screen.getByText('Very strong')).toBeInTheDocument();
    expect(screen.getByText('Very strong')).toHaveClass('text-green-600');
  });
}); 