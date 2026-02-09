import { publicRuntimeConfig } from '@app/shared/config';

export default function Landing() {
  return <div>{publicRuntimeConfig.application.name}</div>;
}
