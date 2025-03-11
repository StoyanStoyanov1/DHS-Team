import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertInfo from './Alert';

jest.useFakeTimers();

describe('AlertInfo', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test('renders with error type correctly', () => {
    render(
      <AlertInfo
        title="Error Title"
        description="Error Description"
        type="error"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-100');
    expect(alert).toHaveClass('border-red-500');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error Description')).toBeInTheDocument();
  });

  test('renders with success type correctly', () => {
    render(
      <AlertInfo
        title="Success Title"
        description="Success Description"
        type="success"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-100');
    expect(alert).toHaveClass('border-green-500');
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success Description')).toBeInTheDocument();
  });

  test('renders with info type correctly', () => {
    render(
      <AlertInfo
        title="Info Title"
        description="Info Description"
        type="info"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-100');
    expect(alert).toHaveClass('border-blue-500');
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info Description')).toBeInTheDocument();
  });

  test('becomes visible after delay', async () => {
    render(
      <AlertInfo
        title="Test Title"
        description="Test Description"
        type="info"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).not.toHaveClass('opacity-100');

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    expect(alert).toHaveClass('opacity-100');
  });

  test('becomes invisible after timeout', async () => {
    render(
      <AlertInfo
        title="Test Title"
        description="Test Description"
        type="info"
      />
    );

    const alert = screen.getByRole('alert');
    
    await act(async () => {
      jest.advanceTimersByTime(800);
    });
    expect(alert).toHaveClass('opacity-100');

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(alert).not.toHaveClass('opacity-100');
  });
}); 