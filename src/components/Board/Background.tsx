import { memo } from 'react';
import ProgressiveImage from 'react-progressive-image';
import { IBoard } from '../../api/types';
import { getSmallUrl, getThumbUrl } from '../../api/unsplash';
import styles from './index.module.scss';

interface IBoardBackgroundProps {
  image: IBoard['image'];
}

function BoardBackground(props: IBoardBackgroundProps) {
  const { image } = props;
  if (image) {
    const smallImage = getSmallUrl(image);
    const thumbImage = getThumbUrl(image);
    const placeholder = (
      <div
        className={styles.background}
        style={{
          filter: 'blur(5px)',
          transform: 'scale(1.05)',
          backgroundImage: thumbImage ? `url(${thumbImage})` : undefined,
        }}
      />
    );
    return (
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
  return <></>;
}

export default memo(BoardBackground);
