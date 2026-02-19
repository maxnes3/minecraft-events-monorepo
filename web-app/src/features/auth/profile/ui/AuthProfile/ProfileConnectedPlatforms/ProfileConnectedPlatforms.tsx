import { Shimmer } from '@app/shared/ui';
import { Platform } from './Platform';
import styles from './ProfileConnectedPlatforms.module.scss';

interface Props {
  platforms?: { name: string; label: string }[];
}

const ProfileConnectedPlatforms: React.FC<Props> = ({ platforms }) => {
  if (!platforms) {
    return <Shimmer className={styles.shimmer} />;
  }

  return (
    <div className={styles.root}>
      {platforms.map((p) => (
        <Platform key={p.name} name={p.name} label={p.label} />
      ))}
    </div>
  );
};

export default ProfileConnectedPlatforms;
