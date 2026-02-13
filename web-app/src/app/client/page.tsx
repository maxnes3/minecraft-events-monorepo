'use client';

import { AuthProvider } from '@app/entities/auth';
import { AuthUserProfile } from '@app/features/auth-user-profile';

export default function Client() {
  return (
    <AuthProvider>
      <AuthUserProfile />
    </AuthProvider>
  );
}
