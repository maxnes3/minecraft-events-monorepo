import {
  Disclosure as HeadlessUiDisclosure,
  DisclosureButton as HeadlessUiDisclosureButton,
  DisclosurePanel as HeadlessUiDisclosurePanel,
  type DisclosureProps as HeadlessUiDisclosureProps
} from '@headlessui/react';
import classNames from 'classnames';
import styles from './Disclosure.module.scss';

type Props = {
  title: React.ReactNode;
  titleClassName?: string;
  panel: React.ReactNode;
  panelClassName?: string;
} & HeadlessUiDisclosureProps;

const Disclosure: React.FC<Props> = (props) => {
  const { title, panel, titleClassName, panelClassName } = props;
  return (
    <HeadlessUiDisclosure {...props}>
      <HeadlessUiDisclosureButton
        className={classNames(styles.title, titleClassName)}
      >
        {title}
      </HeadlessUiDisclosureButton>
      <HeadlessUiDisclosurePanel
        className={classNames(styles.panel, panelClassName)}
      >
        {panel}
      </HeadlessUiDisclosurePanel>
    </HeadlessUiDisclosure>
  );
};

export default Disclosure;
