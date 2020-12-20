import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
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

import styles from '../../styles/BoardCard.module.scss';

interface ICreateBoardCardProps {}

function CreateBoardCard(props: ICreateBoardCardProps) {
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
    <Card className={styles.creator} hoverable onClick={handleClick}>
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
    </Card>
  );
}

export default memo(CreateBoardCard);
