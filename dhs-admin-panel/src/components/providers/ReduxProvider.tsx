'use client';

import { Provider } from 'react-redux';
// Премахваме директния импорт на store, за да предотвратим инициализиране
// import { store } from '@/src/store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux provider component to wrap the application
 * 
 * ВАЖНО: Този компонент е настроен за бъдеща употреба.
 * За да го активирате, разкоментирайте импорта на store и използването му по-долу
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  // В момента не използваме Redux store, просто връщаме децата
  return <>{children}</>;

  // Когато сте готови да използвате Redux:
  // 1. Разкоментирайте импорта на store по-горе
  // 2. Разкоментирайте следния ред и коментирайте горния return
  // return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;