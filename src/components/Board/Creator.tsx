import { LoadingOutlined } from '@ant-design/icons';
import { Card as AntdCard } from 'antd';
import { memo } from 'react';
import { useIntl } from 'react-intl';
import {
  boardActions,
  selectBoardLoading,
  selectUserSignedIn,
  userActions,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';

import styles from './index.module.scss';

interface IBoardCreatorProps {}

function BoardCreator(props: IBoardCreatorProps) {
  const { formatMessage: f } = useIntl();
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
            {f({ id: 'loading' })}
          </>
        ) : (
          f({ id: 'createNewBoard' })
        )}
      </p>
    </AntdCard>
  );
}

export default memo(BoardCreator);
