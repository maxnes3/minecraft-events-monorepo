import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Link.module.scss';

interface Props
  extends NextLinkProps, AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link: React.FC<Props> = (props) => {
  const { className } = props;
  return <NextLink {...props} className={classNames(styles.root, className)} />;
};

export default Link;
