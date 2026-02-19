import Image from 'next/image';
import { useMemo } from 'react';
import { IconStaticPathByPlatform } from '@app/shared/ui/static';
import styles from './Platform.module.scss';

const IMAGE_SIZE = 28;

interface Props {
  name: string;
  label: string;
}

const Platform: React.FC<Props> = ({ name, label }) => {
  const platformIconPath = useMemo(
    () => IconStaticPathByPlatform[name],
    [name]
  );

  return (
    <div className={styles.root}>
      <div className={styles.iconContainer}>
        <Image
          src={platformIconPath}
          alt="platform-icon"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className={styles.icon}
        />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default Platform;
