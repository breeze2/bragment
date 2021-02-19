import { LoadingOutlined } from '@ant-design/icons';
import { Card as AntdCard } from 'antd';
import { memo } from 'react';

import {
  boardActions,
  selectBoardLoading,
  selectUserSignedIn,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import { useFormatMessage } from '../hooks';

import styles from './index.module.scss';

interface IBoardCreatorProps {}

function BoardCreator(props: IBoardCreatorProps) {
  const f = useFormatMessage();
  const dispatch = useReduxDispatch();
  const loading = useReduxSelector(selectBoardLoading);
  const signedIn = useReduxSelector(selectUserSignedIn);
  const handleClick = () => {
    if (loading) {
      // NOTE: do nothing
    } else if (!signedIn) {
      dispatch(userActions.setSignInDialogVisible(true));
    } else {
      dispatch(boardActions.setCreateDialogVisible(true));
    }
  };
  return (
    <AntdCard className={styles.creator} hoverable onClick={handleClick}>
      <p className={styles.title}>
        {loading ? (
          <>
            <LoadingOutlined />
            {f('loading')}
          </>
        ) : (
          f('createNewBoard')
        )}
      </p>
    </AntdCard>
  );
}

export default memo(BoardCreator);
