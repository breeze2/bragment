import { Skeleton } from 'antd';
import React from 'react';
import styles from '../styles/Skeletons.module.scss';

const GistFormContentSkeleton: React.FC = React.memo(() => {
  return (
    <Skeleton
      className={styles.gistFormContent}
      active
      paragraph={{ rows: 11 }}
    />
  );
});

export default GistFormContentSkeleton;
