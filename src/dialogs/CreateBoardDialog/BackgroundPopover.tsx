import { CheckOutlined } from '@ant-design/icons';
import { Col, Popover, Row } from 'antd';
import { memo, ReactElement, MouseEvent as ReactMouseEvent } from 'react';
import { IUnsplashPhoto } from '../../api/types';
import {
  selectStandbyBoardBgColors,
  selectStandbyBoardBgImages,
  useReduxSelector,
} from '../../redux';

import styles from '../../styles/CreateBoardDialog.module.scss';

export interface ISelectedBackground {
  color?: string;
  image?: IUnsplashPhoto;
}

interface IBackgroundPopoverProps {
  children?: ReactElement;
  value: ISelectedBackground;
  onChange?: (value: ISelectedBackground) => void;
  onVisibleChange?: (visible: boolean) => void;
}

function BackgroundPopover(props: IBackgroundPopoverProps) {
  const { children, value, onChange, onVisibleChange } = props;
  const colors = useReduxSelector(selectStandbyBoardBgColors);
  const images = useReduxSelector(selectStandbyBoardBgImages);

  const handleContentClick = (event: ReactMouseEvent) => {
    const target = event.target;
    const icon = target instanceof Element ? target.closest('.anticon') : null;
    if (
      !(icon instanceof HTMLElement) ||
      !icon.dataset ||
      icon.dataset.index === undefined
    ) {
      return;
    }
    const index = icon.dataset.index;
    const bg: ISelectedBackground = {};
    if (icon.dataset.type === 'color') {
      const color = colors[parseInt(index, 10)];
      if (color && color !== value.color) {
        bg.color = color;
      }
    } else if (icon.dataset.type === 'image') {
      const image = images[parseInt(index, 10)];
      if (image && image !== value.image) {
        bg.image = image;
      }
    }
    if (bg.color || bg.image) {
      if (onChange) {
        onChange(bg);
      }
    }
  };

  return (
    <Popover
      trigger="click"
      overlayClassName={styles.overlay}
      onVisibleChange={onVisibleChange}
      content={
        <div className={styles.content} onClick={handleContentClick}>
          {images.length > 0 && (
            <Row gutter={16}>
              {images.map((image, i) => (
                <Col span={6} key={image.id}>
                  <CheckOutlined
                    className={value.image === image ? styles.selected : ''}
                    data-type="image"
                    data-index={i}
                    style={{
                      backgroundColor: image.color,
                      backgroundImage: `url(${image.urls.thumb})`,
                      color: image.color,
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
          <Row gutter={16}>
            {colors.map((color, i) => (
              <Col span={6} key={color}>
                <CheckOutlined
                  className={
                    value.color === color && !value.color ? styles.selected : ''
                  }
                  data-type="color"
                  data-index={i}
                  style={{
                    backgroundColor: color,
                    color,
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      }>
      {children}
    </Popover>
  );
}

export default memo(BackgroundPopover);
