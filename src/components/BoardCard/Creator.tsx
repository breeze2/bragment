import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateBoardDialogVisible } from '../../redux/actions';
import { IReduxState } from '../../redux/types';

import styles from '../../styles/BoardCard.module.scss';

interface ICreateBoardCardProps {}

function CreateBoardCard(props: ICreateBoardCardProps) {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const loading = useSelector((reduxState: IReduxState) =>
    reduxState.board.get('loading')
  );
  const handleClick = () => dispatch(setCreateBoardDialogVisible(true));
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
