'use client';

import Image from 'next/image';
import { useAuthContext } from '@app/entities/auth';
import { useTranslation } from '@app/shared/i18n';
import styles from './AuthUserProfile.module.scss';

const AuthUserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { meState } = useAuthContext();

  if (!meState.value?.profileImg) {
    return;
  }

  return (
    <div className={styles.root}>
      <Image
        src={meState.value?.profileImg}
        alt="profile-image"
        width={64}
        height={64}
        priority={false}
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.info}>
        <h2 className={styles.login}>
          {t('user.profile_login_label', {
            loginName: meState.value.profileLogin
          })}
        </h2>
        <h3 className={styles.platforms}>
          {t('user.profile_connected_platforms_label', {
            platformNames: meState.value.connectedPlatforms.join(', ')
          })}
        </h3>
      </div>
    </div>
  );
};

export default AuthUserProfile;
