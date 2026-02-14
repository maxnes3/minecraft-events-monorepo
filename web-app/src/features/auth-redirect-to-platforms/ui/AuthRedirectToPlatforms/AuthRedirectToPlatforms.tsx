'use client';

import { useTranslation } from '@app/shared/i18n';
import { TwitchStaticPath, YoutubStaticPath } from '@app/shared/ui/static';
import { AuthPlatformButton } from '../AuthPlatformButton';
import styles from './AuthRedirectToPlatforms.module.scss';

const AuthRedirectToPlatforms = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <AuthPlatformButton
        platform="twitch"
        platformLabel={t('platforms.twitch_name')}
        platformIconPath={TwitchStaticPath}
      />
      <AuthPlatformButton
        platform="youtube"
        platformLabel={t('platforms.youtube_name')}
        platformIconPath={YoutubStaticPath}
      />
    </div>
  );
};

export default AuthRedirectToPlatforms;
