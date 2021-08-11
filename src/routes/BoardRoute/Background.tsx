import { memo } from 'react';
import ProgressiveImage from 'react-progressive-image';
import { IBoard } from '../../api/database/types';
import { getRegularUrl, getThumbUrl } from '../../api/unsplash';
import styles from './index.module.scss';

interface IBoardRouteBackgroundProps {
  color: IBoard['color'];
  image: IBoard['image'];
}

function BoardRouteBackground(props: IBoardRouteBackgroundProps) {
  const { color, image } = props;
  if (image) {
    const regularImage = getRegularUrl(image);
    const thumbImage = getThumbUrl(image);
    const placeholder = (
      <div
        className={styles.background}
        style={{
          filter: 'blur(10px)',
          transform: 'scale(1.05)',
          backgroundColor: color || undefined,
          backgroundImage: thumbImage ? `url(${thumbImage})` : undefined,
        }}
      />
    );
    return (
      <ProgressiveImage src={regularImage} placeholder={thumbImage}>
        {(src: string, loading: boolean) =>
          loading ? (
            placeholder
          ) : (
            <div
              className={styles.background}
              style={{
                backgroundColor: color || undefined,
                backgroundImage: src ? `url(${src})` : undefined,
              }}
            />
          )
        }
      </ProgressiveImage>
    );
  }
  return <></>;
}

export default memo(BoardRouteBackground);
