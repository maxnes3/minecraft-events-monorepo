import styles from './PageLayout.module.scss';

interface Props {
  header: React.ReactNode;
  content: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ header, content }) => {
  return (
    <main className={styles.root}>
      <nav className={styles.header}>{header}</nav>
      <div className={styles.content}>{content}</div>
    </main>
  );
};

export default PageLayout;
