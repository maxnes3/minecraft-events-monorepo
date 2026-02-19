import { AuthRedirect } from '@app/features/auth';
import { Header } from '@app/widgets/header';
import { PageLayout } from '@app/widgets/page-layout';

export default function Landing() {
  return <PageLayout header={<Header />} content={<AuthRedirect />} />;
}
