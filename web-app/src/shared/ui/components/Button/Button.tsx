import {
  Button as HeadlessUiButton,
  type ButtonProps as HeadlessUiButtonProps
} from '@headlessui/react';
import classNames from 'classnames';
import styles from './Button.module.scss';

type Props = {} & HeadlessUiButtonProps;

const Button: React.FC<Props> = (props) => {
  const { className } = props;
  return (
    <HeadlessUiButton
      {...props}
      className={classNames(styles.root, className)}
    />
  );
};

export default Button;
