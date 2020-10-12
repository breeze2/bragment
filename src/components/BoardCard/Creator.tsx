import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import {
  boardActions,
  selectBoardLoading,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';

import styles from '../../styles/BoardCard.module.scss';

interface ICreateBoardCardProps {}

function CreateBoardCard(props: ICreateBoardCardProps) {
  const { formatMessage: f } = useIntl();
  const dispatch = useReduxDispatch();
  const loading = useReduxSelector(selectBoardLoading);
  const handleClick = () => dispatch(boardActions.setCreateDialogVisible(true));
  return (
    <Card
      className={styles.creator}
      hoverable
      onClick={loading === true ? undefined : handleClick}>
      <p className={styles.title}>
        {loading === true ? (
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
