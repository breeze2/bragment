import { Card as AntdCard } from 'antd';
import { memo } from 'react';
import { IBoard } from '../../api/database/types';
import BoardBackground from './Background';
import styles from './index.module.scss';

interface IBoardProps {
  board: IBoard;
}

function Board(props: IBoardProps) {
  const { board } = props;
  const { color, image, title } = board;
  return (
    <AntdCard
      className={styles.wrapper}
      hoverable
      bordered={false}
      style={{
        backgroundColor: color,
      }}>
      <BoardBackground image={image} />
      <div className={styles.foreground}>
        <p className={styles.title}>{title}</p>
      </div>
    </AntdCard>
  );
}

export default memo(Board);
