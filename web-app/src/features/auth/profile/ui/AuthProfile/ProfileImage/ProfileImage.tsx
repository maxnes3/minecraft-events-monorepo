import Image from 'next/image';
import { Shimmer } from '@app/shared/ui';
import styles from './ProfileImage.module.scss';

const DEFAULT_IMAGE_SIZE = 78;

interface Props {
  path?: string;
}

const ProfileImage: React.FC<Props> = ({ path }) => {
  if (!path) {
    return <Shimmer className={styles.shimmer} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        <Image
          src={path}
          alt="profile-image"
          width={DEFAULT_IMAGE_SIZE}
          height={DEFAULT_IMAGE_SIZE}
          priority={false}
          loading="lazy"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default ProfileImage;
