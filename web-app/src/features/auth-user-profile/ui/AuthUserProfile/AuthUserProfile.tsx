'use client';

import Image from 'next/image';
import { useAuthContext } from '@app/entities/auth';
import styles from './AuthUserProfile.module.scss';

const AuthUserProfile: React.FC = () => {
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
        className={styles.image}
      />
      <h3 className={styles.login}>{meState.value.profileLogin}</h3>
    </div>
  );
};

export default AuthUserProfile;
