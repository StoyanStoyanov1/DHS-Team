'use client';

import { createContext } from 'react';
import { AuthContextType } from '@/src/types/auth.types';

/**
 * Context for authentication state and methods
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;