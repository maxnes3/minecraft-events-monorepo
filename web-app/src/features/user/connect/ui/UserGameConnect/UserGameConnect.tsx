'use client';

import { useUserContext } from '@app/entities/user';
import { useTranslation } from '@app/shared/i18n';
import { Button, Shimmer } from '@app/shared/ui';
import styles from './UserGameConnect.module.scss';

interface Props {
  isLoading?: boolean;
}

const UserGameConnect: React.FC<Props> = ({ isLoading }) => {
  const { t } = useTranslation();
  const { onGetGameConnectToken } = useUserContext();

  const handleOnClick = () => {
    onGetGameConnectToken()
      .then((data) => {
        if (!data?.token) {
          return;
        }
        navigator.clipboard.writeText(data.token);
        alert(t('games.connect_token_copied_label'));
      })
      .catch((error) => {
        console.error(`Error fetching game connection token:`, error);
      });
  };

  if (isLoading) {
    return <Shimmer className={styles.shimmer} />;
  }

  return (
    <Button className={styles.root} onClick={handleOnClick}>
      {t('games.connect_game_label')}
    </Button>
  );
};

export default UserGameConnect;
