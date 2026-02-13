'use client';

import { publicRuntimeConfig } from '@app/shared/config';
import { useTranslation } from '@app/shared/i18n';
import { AuthPlatformButton } from '../AuthPlatformButton';
import styles from './AuthRedirectToPlatforms.module.scss';

const AuthRedirectToPlatforms = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <AuthPlatformButton
        platform="twitch"
        platformLabel={t('platforms.twitch_name')}
        platformIconPath={`${publicRuntimeConfig.static.icons}/twitch.svg`}
      />
      <AuthPlatformButton
        platform="youtube"
        platformLabel={t('platforms.youtube_name')}
        platformIconPath={`${publicRuntimeConfig.static.icons}/youtube.svg`}
      />
    </div>
  );
};

export default AuthRedirectToPlatforms;
