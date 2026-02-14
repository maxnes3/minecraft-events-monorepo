import Image from 'next/image';
import { useCallback } from 'react';
import { GetAuthRedirectUrlRequest } from '@app/entities/auth';
import { PlatformAuthRedirectEndpointUrl } from '@app/shared/api';
import { publicRuntimeConfig } from '@app/shared/config';
import { Button } from '@app/shared/ui';
import { UserPageUrl } from '@app/shared/routes';
import styles from './AuthPlatformButton.module.scss';

const DEFAULT_ICON_SIZE = 56;

interface Props {
  platform: string;
  platformLabel: string;
  platformIconPath: string;
}

const AuthPlatformButton: React.FC<Props> = ({
  platform,
  platformLabel,
  platformIconPath
}) => {
  const handleRedirectToAuth = useCallback((platform: string) => {
    if (!publicRuntimeConfig.platforms.list.includes(platform)) {
      return;
    }

    const redirectUrl = new URL(
      `${publicRuntimeConfig.application.domain}${UserPageUrl}`
    );
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
        width={DEFAULT_ICON_SIZE}
        height={DEFAULT_ICON_SIZE}
        alt={`${platform}-icon`}
        className={styles.icon}
      />
      <div className={styles.label}>{platformLabel}</div>
    </Button>
  );
};

export default AuthPlatformButton;
