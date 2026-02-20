'use client';

import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { GetAuthRedirectUrlRequest } from '@app/entities/auth';
import { PlatformAuthRedirectEndpointUrl } from '@app/shared/api';
import { IconStaticPathByPlatform } from '@app/shared/ui/static';
import { publicRuntimeConfig } from '@app/shared/config';
import { Button } from '@app/shared/ui';
import { UserPageWithDomainUrl } from '@app/shared/routes';
import styles from './RedirectToPlatformButton.module.scss';

const ICON_SIZE = 56;

interface Props {
  platform: string;
  platformLabel: string;
}

const RedirectToPlatformButton: React.FC<Props> = ({
  platform,
  platformLabel
}) => {
  const platformIconPath = useMemo(
    () => IconStaticPathByPlatform[platform],
    [platform]
  );

  const handleRedirectToAuth = useCallback((platform: string) => {
    if (!publicRuntimeConfig.platforms.list.includes(platform)) {
      return;
    }

    const redirectUrl = new URL(UserPageWithDomainUrl);
    redirectUrl.searchParams.append('platform', platform);
    const url = PlatformAuthRedirectEndpointUrl(platform);

    GetAuthRedirectUrlRequest({
      url,
      options: {
        params: {
          redirect_url: redirectUrl.toString()
        }
      }
    })
      .then((response) => {
        if (!response?.success || !response?.data?.url) {
          return;
        }
        window.location.href = response.data.url;
      })
      .catch((error) => {
        console.error(`Error redirecting to ${platform}:`, error);
      });
  }, []);

  return (
    <Button
      className={styles.root}
      onClick={() => handleRedirectToAuth(platform)}
    >
      <Image
        src={platformIconPath}
        width={ICON_SIZE}
        height={ICON_SIZE}
        alt={`${platform}-icon`}
        className={styles.icon}
      />
      <span className={styles.label}>{platformLabel}</span>
    </Button>
  );
};

export default RedirectToPlatformButton;
