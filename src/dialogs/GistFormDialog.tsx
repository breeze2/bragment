import { Input, Modal } from 'antd';
import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EFragmentType } from '../api/types';
import { setCurrentFragment } from '../redux/actions';
import { IReduxState } from '../redux/types';
import GistCodeEditorSkeleton from '../skeletons/GistCodeEditorSkeleton';

import styles from '../styles/GistFormDialog.module.scss';

const GistCodeEditor = React.lazy(() => import('../components/GistCodeEditor'));

const GistFormDialog: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const currentFragment = useSelector(
    (state: IReduxState) => state.fragment.current
  );
  const visible =
    !!currentFragment && currentFragment.type === EFragmentType.GIST;

  const handleClose = () => dispatch(setCurrentFragment(null));
  return (
    <Modal
      className={styles.wrapper}
      visible={visible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}>
      <Input className={styles.description} />
      <Suspense fallback={<GistCodeEditorSkeleton />}>
        <GistCodeEditor />
      </Suspense>
    </Modal>
  );
});

export default GistFormDialog;
