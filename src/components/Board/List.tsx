import { memo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { a, config, useTrail } from 'react-spring';
import { IBoard } from '../../api/database/types';
import styles from './index.module.scss';
import Board from './index';

interface IBoardListProps {
  boards: IBoard[];
  label?: string;
  icon?: ReactNode;
}

function BoardList(props: IBoardListProps) {
  const { boards, icon, label } = props;
  const trail = useTrail(boards.length, {
    config: { ...config.gentle, duration: config.gentle.tension },
    delay: 120,
    opacity: 1,
    x: '0%',
    y: '0px',
    from: { opacity: 0.5, x: '60%', y: '96px' },
  });
  return (
    <div className={styles.boardList}>
      <p className={styles.boardListLabel}>
        {icon}
        {label}
      </p>
      <div className="ant-row">
        {trail.map((style, index) => {
          const board = boards[index];
          return (
            <a.div
              className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6"
              key={index}
              style={style}>
              <Link to={`/board/${board.id}`}>
                <Board board={board} />
              </Link>
            </a.div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(BoardList);
