import { Shimmer } from '@app/shared/ui';
import styles from './ProfileLogin.module.scss';

interface Props {
  login?: string;
}

const ProfileLogin: React.FC<Props> = ({ login }) => {
  if (!login) {
    return <Shimmer className={styles.shimmer} />;
  }

  return <h1 className={styles.root}>{login}</h1>;
};

export default ProfileLogin;
