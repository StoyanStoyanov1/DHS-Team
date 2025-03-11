import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';
import userEvent from '@testing-library/user-event';

describe('Alert', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders with error type correctly', async () => {
    render(
      <Alert
        title="Error Title"
        description="Error Description"
        type="error"
      />
    );

    // Wait for initial appearance
    act(() => {
      jest.advanceTimersByTime(800);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('from-red-50');
    expect(alert).toHaveClass('border-red-500');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error Description')).toBeInTheDocument();
  });

  test('renders with success type correctly', async () => {
    render(
      <Alert
        title="Success Title"
        description="Success Description"
        type="success"
      />
    );

    // Wait for initial appearance
    act(() => {
      jest.advanceTimersByTime(800);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('from-green-50');
    expect(alert).toHaveClass('border-green-500');
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success Description')).toBeInTheDocument();
  });

  test('renders with info type correctly', async () => {
    render(
      <Alert
        title="Info Title"
        description="Info Description"
        type="info"
      />
    );

    // Wait for initial appearance
    act(() => {
      jest.advanceTimersByTime(800);
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('from-blue-50');
    expect(alert).toHaveClass('border-blue-500');
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info Description')).toBeInTheDocument();
  });

  test('becomes visible after delay', async () => {
    render(
      <Alert
        title="Test Title"
        description="Test Description"
        type="info"
      />
    );

    // Initially not visible
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Wait for initial appearance
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Now visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('becomes invisible after timeout', async () => {
    render(
      <Alert
        title="Test Title"
        description="Test Description"
        type="info"
      />
    );

    // Initially not visible
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Wait for initial appearance (800ms)
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Check if alert is visible
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Fast-forward to complete auto-close timeout (4000ms total)
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Fast-forward past the exit animation duration (200ms)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Wait for the element to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
}); 