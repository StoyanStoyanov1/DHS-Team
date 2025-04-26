import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavItem from '../NavItem';

describe('NavItem Component', () => {
  // Тестови пропс
  const defaultProps = {
    icon: <span data-testid="mock-icon">Icon</span>,
    label: 'Test Item',
    active: false,
    onClick: jest.fn(),
    isCollapsed: false
  };

  beforeEach(() => {
    // Изчистваме мок функциите между тестовете
    jest.clearAllMocks();
  });

  test('renders correctly with default props', () => {
    render(<NavItem {...defaultProps} />);
    
    // Проверяваме дали иконата и лейбъла са рендерирани
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    
    // Проверяваме дали няма бадж, когато не е предоставен
    const badgeElements = screen.queryAllByRole('div', { className: /bg-red-500/ });
    expect(badgeElements.length).toBe(0);
  });

  test('renders in active state correctly', () => {
    render(<NavItem {...defaultProps} active={true} />);
    
    // Взимаме основния контейнер
    const navItemContainer = screen.getByText('Test Item').closest('div');
    
    // Проверяваме дали класовете за активно състояние са приложени
    expect(navItemContainer).toHaveClass('bg-blue-50');
    expect(navItemContainer).toHaveClass('text-blue-600');
    expect(navItemContainer).toHaveClass('border-blue-600');
    
    // Проверяваме дали текстът на етикета използва правилния цвят
    const label = screen.getByText('Test Item');
    expect(label).toHaveClass('text-blue-600');
  });

  test('renders badge when provided', () => {
    render(<NavItem {...defaultProps} badge="5" />);
    
    // Проверяваме дали баджът е рендериран с правилния текст
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    
    // Проверяваме дали баджът има правилните стилове
    const badgeContainer = badge.closest('div');
    expect(badgeContainer).toHaveClass('bg-red-500');
    expect(badgeContainer).toHaveClass('text-white');
    expect(badgeContainer).toHaveClass('rounded-full');
  });

  test('hides label and badge when collapsed', () => {
    render(<NavItem {...defaultProps} isCollapsed={true} />);
    
    // Проверяваме дали иконата е видима
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    
    // Проверяваме дали етикетът не е видим
    expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
  });

  test('sets title attribute when collapsed', () => {
    const { container } = render(<NavItem {...defaultProps} isCollapsed={true} />);
    
    // Взимаме директно основния контейнер от рендера
    // Това е първият div в рендерирания компонент
    const navItem = container.firstChild;
    
    // Проверяваме дали атрибутът title е зададен
    expect(navItem).toHaveAttribute('title', 'Test Item');
  });

  test('does not set title attribute when not collapsed', () => {
    const { container } = render(<NavItem {...defaultProps} isCollapsed={false} />);
    
    // Взимаме директно основния контейнер от рендера
    const navItem = container.firstChild;
    
    // Проверяваме дали атрибутът title не е зададен
    expect(navItem).not.toHaveAttribute('title');
  });

  test('calls onClick when clicked', () => {
    render(<NavItem {...defaultProps} />);
    
    // Намираме NavItem елемента и кликваме върху него
    const navItem = screen.getByText('Test Item').closest('div');
    fireEvent.click(navItem);
    
    // Проверяваме дали onClick функцията е била извикана
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});