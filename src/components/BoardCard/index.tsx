import { Card } from 'antd';
import React from 'react';
import { IBoard } from '../../api/types';
import { getSmallUrl } from '../../api/unsplash';

import styles from '../../styles/BoardCard.module.scss';

interface IBoardCardProps {
  board: IBoard;
}

const BoardCard: React.FC<IBoardCardProps> = React.memo((props) => {
  const { board } = props;
  const { color, image, title } = board;
  return (
    <Card
      className={styles.wrapper}
      hoverable
      bordered={false}
      style={{
        backgroundColor: color,
      }}>
      <div
        className={styles.background}
        style={{
          backgroundImage: image ? `url(${getSmallUrl(image)})` : undefined,
        }}
      />
      <div className={styles.frontground}>
        <p className={styles.title}>{title}</p>
      </div>
    </Card>
  );
});

export default BoardCard;
