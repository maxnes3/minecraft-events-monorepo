'use client';

import { useTranslation } from '@app/shared/i18n';
import { RedirectToPlatformButton } from './RedirectToPlatformButton';
import styles from './AuthRedirect.module.scss';

const AuthRedirect: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <RedirectToPlatformButton
        platform="twitch"
        platformLabel={t('platforms.twitch_name')}
      />
      <RedirectToPlatformButton
        platform="youtube"
        platformLabel={t('platforms.youtube_name')}
      />
    </div>
  );
};

export default AuthRedirect;
