import {
  Dialog as HeadlessUiDialog,
  type DialogProps as HeadlessUiDialogProps
} from '@headlessui/react';
import classNames from 'classnames';
import styles from './Dialog.module.scss';

type Props = {} & HeadlessUiDialogProps;

const Dialog: React.FC<Props> = (props) => {
  const { className } = props;
  return (
    <HeadlessUiDialog
      {...props}
      className={classNames(styles.root, className)}
    ></HeadlessUiDialog>
  );
};

export default Dialog;
