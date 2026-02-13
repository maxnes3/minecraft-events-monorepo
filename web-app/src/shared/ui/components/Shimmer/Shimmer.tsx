import classNames from 'classnames';
import styles from './Shimmer.module.scss';

type Props = {
  className?: string;
};

const Shimmer: React.FC<Props> = ({ className }) => {
  return <div className={classNames(styles.root, className)}></div>;
};

export default Shimmer;
