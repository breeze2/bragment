import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setCreateBoardDialogVisible } from '../../redux/actions';

import styles from '../../styles/BoardCard.module.scss';

interface ICreateBoardCardProps {
  isLoading: boolean;
}

function CreateBoardCard(props: ICreateBoardCardProps) {
  const { isLoading } = props;
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setCreateBoardDialogVisible(true));
  return (
    <Card
      className={styles.creator}
      hoverable
      onClick={isLoading === true ? undefined : handleClick}>
      <p className={styles.title}>
        {isLoading === true ? (
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
