import { Card } from 'antd';
import React, { memo } from 'react';
import ProgressiveImage from 'react-progressive-image';
import { IBoard } from '../../api/types';
import { getSmallUrl, getThumbUrl } from '../../api/unsplash';

import styles from '../../styles/BoardCard.module.scss';

interface IBoardCardProps {
  board: IBoard;
}

function BoardCard(props: IBoardCardProps) {
  const { board } = props;
  const { color, image, title } = board;
  let progressiveImage;
  if (image) {
    const smallImage = getSmallUrl(image);
    const thumbImage = getThumbUrl(image);
    const placeholder = (
      <div
        className={styles.background}
        style={{
          filter: 'blur(10px)',
          backgroundImage: thumbImage ? `url(${thumbImage})` : undefined,
        }}
      />
    );
    progressiveImage = (
      <ProgressiveImage src={smallImage} placeholder={thumbImage}>
        {(src: string, loading: boolean) =>
          loading ? (
            placeholder
          ) : (
            <div
              className={styles.background}
              style={{
                backgroundImage: src ? `url(${src})` : undefined,
              }}
            />
          )
        }
      </ProgressiveImage>
    );
  }
  return (
    <Card
      className={styles.wrapper}
      hoverable
      bordered={false}
      style={{
        backgroundColor: color,
      }}>
      {progressiveImage}
      <div className={styles.foreground}>
        <p className={styles.title}>{title}</p>
      </div>
    </Card>
  );
}

export default memo(BoardCard);
