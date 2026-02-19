'use client';

import { useAuthContext } from '@app/entities/auth';
import { useTranslation } from '@app/shared/i18n';
import { ProfileImage } from './ProfileImage';
import { ProfileLogin } from './ProfileLogin';
import { ProfileConnectedPlatforms } from './ProfileConnectedPlatforms';
import styles from './AuthProfile.module.scss';

const PLATFORMS_TKEYS: Record<string, string> = {
  twitch: 'platforms.twitch_name',
  youtube: 'platforms.youtube_name'
};

const AuthProfile: React.FC = () => {
  const { t } = useTranslation();
  const { meState } = useAuthContext();

  return (
    <div className={styles.root}>
      <ProfileImage path={meState.value?.profileImg} />
      <div className={styles.info}>
        <ProfileLogin login={meState.value?.profileLogin} />
        <ProfileConnectedPlatforms
          platforms={meState.value?.connectedPlatforms.map((p) => {
            return { name: p, label: t(PLATFORMS_TKEYS[p]) };
          })}
        />
      </div>
    </div>
  );
};

export default AuthProfile;
