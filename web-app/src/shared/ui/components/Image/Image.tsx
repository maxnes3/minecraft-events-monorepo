import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import classNames from 'classnames';
import styles from './Image.module.scss';

const DEFAULT_IMAGE_SIZE = 128;

interface Props extends NextImageProps {}

const Image: React.FC<Props> = (props) => {
  const { className, width, height } = props;
  return (
    <NextImage
      {...props}
      width={width || DEFAULT_IMAGE_SIZE}
      height={height || DEFAULT_IMAGE_SIZE}
      className={classNames(styles.root, className)}
    />
  );
};

export default Image;
