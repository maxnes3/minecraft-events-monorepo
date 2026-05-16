'use client';

import { Button, Shimmer } from '@app/shared/ui';
import { useAuthContext } from '@app/entities/auth';
import { useTranslation } from '@app/shared/i18n';
import styles from './AuthLogout.module.scss';

const AuthLogout: React.FC = () => {
  const { t } = useTranslation();
  const { meState, onLogout } = useAuthContext();

  const handleOnClick = () => {
    onLogout();
  };

  if (!meState.value) {
    return <Shimmer className={styles.shimmer} />;
  }

  return (
    <Button onClick={handleOnClick} className={styles.root}>
      {t('auth.logout_label')}
    </Button>
  );
};

export default AuthLogout;
