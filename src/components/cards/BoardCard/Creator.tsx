import { Card } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setCreateBoardDialogVisible } from '../../../redux/actions';

import styles from '../../../styles/BoardCard.module.scss';

const CreateBoardCard: React.FC = React.memo(() => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setCreateBoardDialogVisible(true));
  return (
    <Card className={styles.creator} hoverable onClick={handleClick}>
      <p className={styles.title}>{f({ id: 'createNewBoard' })}</p>
    </Card>
  );
});

export default CreateBoardCard;
