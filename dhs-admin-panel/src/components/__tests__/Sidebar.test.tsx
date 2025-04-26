import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Мокваме next/navigation, тъй като Sidebar компонентът го използва
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  usePathname: () => '/dashboard'
}));

describe('Sidebar Component', () => {
  const defaultProps = {
    activeSection: 'dashboards',
    setActiveSection: jest.fn(),
    isCollapsed: false,
    toggleCollapse: jest.fn()
  };

  // Помощна функция за предизвикване на hover ефект
  const triggerHover = (element) => {
    fireEvent.mouseEnter(element);
  };

  test('toggles pin state when pin button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Намираме бутона за закачане и го кликваме
    const pinButton = screen.getByTitle('Закачи сайдбара отворен');
    fireEvent.click(pinButton);
    
    // След закачане, бутонът трябва да промени title
    expect(screen.getByTitle('Прибери сайдбара')).toBeInTheDocument();
    
    // Кликваме отново, за да го откачим
    fireEvent.click(screen.getByTitle('Прибери сайдбара'));
    
    // Проверяваме дали отново имаме първоначалния title
    expect(screen.getByTitle('Закачи сайдбара отворен')).toBeInTheDocument();
  });

  test('calls setActiveSection when a navigation item is clicked', () => {
    const mockSetActiveSection = jest.fn();
    
    const { container } = render(
      <Sidebar 
        {...defaultProps} 
        setActiveSection={mockSetActiveSection} 
      />
    );
    
    // Предизвикваме hover ефект, за да се разгъне sidebar и да се покажат елементите
    const sidebarContainer = container.firstChild;
    triggerHover(sidebarContainer);
    
    // Намираме NavItem за Layouts по текста вместо по title
    const layoutsItem = screen.getByText('Layouts');
    fireEvent.click(layoutsItem.closest('.flex.items-center'));
    
    // Проверяваме дали setActiveSection е извикан с правилния аргумент
    expect(mockSetActiveSection).toHaveBeenCalledWith('layouts');
  });

  test('changes appearance when hovered', () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    
    // Взимаме sidebar контейнера
    const sidebarElement = container.firstChild;
    
    // Началната ширина е малка (w-20)
    expect(sidebarElement).toHaveClass('w-20');
    
    // При hover, ширината трябва да се увеличи
    fireEvent.mouseEnter(sidebarElement);
    expect(sidebarElement).toHaveClass('w-64');
    
    // След като махнем hover, трябва да се върне към малката ширина
    fireEvent.mouseLeave(sidebarElement);
    expect(sidebarElement).toHaveClass('w-20');
  });
});