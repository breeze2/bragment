import { CheckOutlined } from '@ant-design/icons';
import { Col, Popover, Row } from 'antd';
import React, {
  memo,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  useState,
} from 'react';
import { IUnsplashPhoto } from '../api/types';
import {
  selectStandbyBoardBgColors,
  selectStandbyBoardBgImages,
  useReduxSelector,
} from '../redux';

import styles from '../styles/BoardBackgroundPopover.module.scss';

export interface ISelectedBackground {
  color?: string;
  image?: IUnsplashPhoto;
}

interface IBoardBackgroundPopoverProps {
  defaultValue: ISelectedBackground;
  children?: ReactElement;
  onChange?: (value: ISelectedBackground) => void;
}

function BoardBackgroundPopover(props: IBoardBackgroundPopoverProps) {
  const colors = useReduxSelector(selectStandbyBoardBgColors);
  const images = useReduxSelector(selectStandbyBoardBgImages);
  const [selectedValue, setSelectedValue] = useState<ISelectedBackground>({});

  const handleContentClick = (event: ReactMouseEvent) => {
    const target = event.target;
    const icon =
      target instanceof HTMLElement ? target.closest('.anticon') : null;
    if (
      !(icon instanceof HTMLElement) ||
      !icon.dataset ||
      icon.dataset.index === undefined
    ) {
      return;
    }
    const index = icon.dataset.index;
    const value: ISelectedBackground = { image: undefined, color: undefined };
    if (icon.dataset.type === 'color') {
      const color = colors[parseInt(index, 10)];
      if (color && color !== selectedValue.color) {
        value.color = color;
      }
    } else if (icon.dataset.type === 'image') {
      const image = images[parseInt(index, 10)];
      if (image && image !== selectedValue.image) {
        value.image = image;
      }
    }
    if (value.color || value.image) {
      setSelectedValue(value);
      if (props.onChange) {
        props.onChange(value);
      }
    }
  };
  const realSelectedValue =
    selectedValue.color || selectedValue.image
      ? selectedValue
      : props.defaultValue;
  return (
    <Popover
      trigger="click"
      overlayClassName={styles.overlay}
      content={
        <div className={styles.content} onClick={handleContentClick}>
          {images.length > 0 && (
            <Row gutter={16}>
              {images.map((image, i) => (
                <Col span={6} key={image.id}>
                  <CheckOutlined
                    className={
                      realSelectedValue.image === image ? styles.selected : ''
                    }
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
                    realSelectedValue.color === color ? styles.selected : ''
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
      {props.children}
    </Popover>
  );
}

export default memo(BoardBackgroundPopover);
