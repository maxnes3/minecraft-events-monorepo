'use client';

import { createContext, useContext } from 'react';
import { type UserContextType } from './user-context.type';

export const UserContext = createContext({} as UserContextType);

export const useUserContext = () => useContext(UserContext);
