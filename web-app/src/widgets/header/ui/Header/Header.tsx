'use client';

import { Button, Image, Link } from '@app/shared/ui';
import { useTranslation } from '@app/shared/i18n';
import { FaviconStaticPath, GithubIconStaticPath } from '@app/shared/ui/static';
import { GithubRepositoryUrl } from '@app/shared/routes';
import styles from './Header.module.scss';
import { publicRuntimeConfig } from '@app/shared/config';

const LOGO_IMAGE_SIZE = 32;

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <Image
          src={FaviconStaticPath}
          alt="streaming-events-app-logo"
          width={LOGO_IMAGE_SIZE}
          height={LOGO_IMAGE_SIZE}
          loading="lazy"
        />
        <h3 className={styles.label}>{t('config.app_name')}</h3>
      </div>
      <div className={styles.info}>
        <span
          className={styles.version}
        >{`v${publicRuntimeConfig.application.version}`}</span>
        <Link
          href={GithubRepositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className={styles.github}>
            <Image
              src={GithubIconStaticPath}
              alt="github-logo"
              width={LOGO_IMAGE_SIZE}
              height={LOGO_IMAGE_SIZE}
              loading="lazy"
            />
            <span className={styles.label}>{t('external.github_label')}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
