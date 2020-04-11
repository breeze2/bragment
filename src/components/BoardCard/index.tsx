import { Card } from 'antd';
import React from 'react';
import { getBoardImageURL } from '../../api/board';
import { IBoard } from '../../api/types';

import styles from '../../styles/BoardCard.module.scss';

interface IBoardCardProps {
  board: IBoard;
}

const BoardCard: React.FC<IBoardCardProps> = React.memo((props) => {
  const { board } = props;
  const { color, image, path, title } = board;
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
          backgroundImage:
            path && image ? `url(${getBoardImageURL(board)})` : undefined,
        }}
      />
      <div className={styles.frontground}>
        <p className={styles.title}>{title}</p>
      </div>
    </Card>
  );
});

export default BoardCard;
