'use client';

import { createContext, useContext } from 'react';
import { type AuthContextType } from '@app/entities/auth/model';

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);
