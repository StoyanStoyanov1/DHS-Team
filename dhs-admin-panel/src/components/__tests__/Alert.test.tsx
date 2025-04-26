import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert Component', () => {
  test('renders success alert correctly', () => {
    render(<Alert type="success" message="Operation successful" />);
    
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    // Проверка за правилния CSS клас според типа алерта - трябва да проверяваме родителския div
    const alertContainer = screen.getByText('Operation successful').closest('.rounded-md');
    expect(alertContainer).toHaveClass('bg-green-50');
    expect(alertContainer).toHaveClass('text-green-700');
  });

  test('renders error alert correctly', () => {
    render(<Alert type="error" message="An error occurred" />);
    
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    const alertContainer = screen.getByText('An error occurred').closest('.rounded-md');
    expect(alertContainer).toHaveClass('bg-red-50');
    expect(alertContainer).toHaveClass('text-red-700');
  });

  test('renders warning alert correctly', () => {
    render(<Alert type="warning" message="This is a warning" />);
    
    expect(screen.getByText('This is a warning')).toBeInTheDocument();
    const alertContainer = screen.getByText('This is a warning').closest('.rounded-md');
    expect(alertContainer).toHaveClass('bg-yellow-50');
    expect(alertContainer).toHaveClass('text-yellow-700');
  });

  test('renders info alert correctly', () => {
    render(<Alert type="info" message="Information message" />);
    
    expect(screen.getByText('Information message')).toBeInTheDocument();
    const alertContainer = screen.getByText('Information message').closest('.rounded-md');
    expect(alertContainer).toHaveClass('bg-blue-50');
    expect(alertContainer).toHaveClass('text-blue-700');
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<Alert type="info" message="Closable alert" onClose={onCloseMock} />);
    
    // Намираме бутона Dismiss използвайки accessibility role
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // Проверяваме дали onClose функцията е била извикана
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('does not render close button when onClose is not provided', () => {
    render(<Alert type="info" message="Alert without close button" />);
    
    // Търсим бутона и очакваме да не го намерим
    const closeButton = screen.queryByRole('button');
    expect(closeButton).not.toBeInTheDocument();
  });
});