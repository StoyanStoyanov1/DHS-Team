'use client';

import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux provider component to wrap the application
 * Provides the Redux store to all child components
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;