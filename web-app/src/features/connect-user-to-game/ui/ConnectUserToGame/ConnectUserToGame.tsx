'use client';

import { useCallback } from 'react';
import { useTranslation } from '@app/shared/i18n';
import { Button } from '@app/shared/ui';
import styles from './ConnectUserToGame.module.scss';

const ConnectUserToGame: React.FC = () => {
  const { t } = useTranslation();

  const handleOnClick = useCallback(() => {}, []);

  return (
    <Button className={styles.root} onClick={handleOnClick}>
      {t('games.connect_label')}
    </Button>
  );
};

export default ConnectUserToGame;
