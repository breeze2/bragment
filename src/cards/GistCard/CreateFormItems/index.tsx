import { lazy, memo, Suspense } from 'react';
import { ICreateCardFormItemsProps } from '../../types';
import styles from '../index.module.scss';
import LoadingSkeleton from './LoadingSkeleton';

const FormItems = lazy(() => import('./FormItems'));

function CreateFormItems(props: ICreateCardFormItemsProps) {
  return (
    <div className={styles.createFormItems}>
      <Suspense fallback={<LoadingSkeleton />}>
        <FormItems {...props} />
      </Suspense>
    </div>
  );
}

export default memo(CreateFormItems);
