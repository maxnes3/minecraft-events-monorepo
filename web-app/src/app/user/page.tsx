'use client';

import { AuthProvider } from '@app/entities/auth';
import { AuthUserProfile } from '@app/features/auth-user-profile';
import { ConnectUserToGame } from '@app/features/connect-user-to-game';

export default function User() {
  return (
    <AuthProvider>
      <AuthUserProfile />
      <ConnectUserToGame />
    </AuthProvider>
  );
}
