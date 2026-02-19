'use client';

import { AuthProvider } from '@app/features/auth';
import { PageLayout } from '@app/widgets/page-layout';
import { Header } from '@app/widgets/header';
import { UserControlls } from '@app/widgets/user-controlls';
import { UserProvider } from '@app/features/user';

export default function User() {
  return (
    <AuthProvider>
      <UserProvider>
        <PageLayout header={<Header />} content={<UserControlls />} />
      </UserProvider>
    </AuthProvider>
  );
}
