import { CheckOutlined } from '@ant-design/icons';
import { Col, Popover, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { IUnsplashPhoto } from '../api/types';
import { IReduxState } from '../redux/types';

import styles from '../styles/BoardBackgroundPopover.module.scss';

export interface ISelectedBackground {
  color?: string;
  image?: IUnsplashPhoto;
}

interface IBoardBackgroundPopoverProps {
  defaultValue: ISelectedBackground;
  children?: React.ReactElement;
  onChange?: (value: ISelectedBackground) => void;
}

const BoardBackgroundPopover: React.FC<IBoardBackgroundPopoverProps> = React.memo(
  (props) => {
    const colors = useSelector(
      (state: IReduxState) => state.board.standbyBgColors
    );
    const images = useSelector(
      (state: IReduxState) => state.board.standbyBgImages
    );
    const [selectedValue, setSelectedValue] = React.useState<
      ISelectedBackground
    >({});

    const handleContentClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      const target = event.target as HTMLDivElement;
      const icon = target.closest('.anticon') as HTMLSpanElement;
      if (!icon || !icon.dataset || icon.dataset.index === undefined) {
        return;
      }
      const index = icon.dataset.index;
      const value: ISelectedBackground = {};
      if (icon.dataset.type === 'color') {
        const color = colors.get(parseInt(index, 10));
        if (color && color !== selectedValue.color) {
          value.color = color;
        }
      } else if (icon.dataset.type === 'image') {
        const image = images.get(parseInt(index, 10));
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
            {images.size > 0 && (
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
);

export default BoardBackgroundPopover;
