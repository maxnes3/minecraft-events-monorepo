import { AuthProfile, AuthLogout } from '@app/features/auth';
import { UserGameConnect } from '@app/features/user';
import { Separator } from '@app/shared/ui';
import styles from './UserControlls.module.scss';

const UserControlls: React.FC = () => {
  return (
    <div className={styles.root}>
      <AuthProfile />
      <Separator />
      <UserGameConnect />
      <AuthLogout />
    </div>
  );
};

export default UserControlls;
