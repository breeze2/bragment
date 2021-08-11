import classnames from 'classnames';
import { memo, useCallback, useRef, useState } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import {
  positionValues as IPositionValues,
  Scrollbars,
} from 'react-custom-scrollbars';

import { ICard, IColumn } from '../../api/database/types';
import { selectCardEntities, useReduxSelector } from '../../redux';
import { APP_HEADER_HEIGHT } from '../../redux/types';
import Card from '../Card';
import Footer, { EMode as EFooterMode } from './Footer';
import Header from './Header';
import styles from './index.module.scss';

interface IColumnProps {
  data: IColumn;
  index: number;
}

function Column(props: IColumnProps) {
  const { data, index } = props;
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = useState(
    `calc(100vh - ${APP_HEADER_HEIGHT}px - 16px - 48px - 48px - 16px)`
  );
  const cardEntities = useReduxSelector(selectCardEntities);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const handleFooterModeChange = useCallback(
    (mode: EFooterMode, clientHeight?: number) => {
      if (mode === EFooterMode.TEXT) {
        setScrollbarMaxHeight(
          `calc(100vh - ${APP_HEADER_HEIGHT}px - 16px - 48px - 48px - 16px)`
        );
      } else {
        setScrollbarMaxHeight(
          `calc(100vh - ${APP_HEADER_HEIGHT}px - 16px - 48px - ${
            clientHeight || 88
          }px - 16px)`
        );
      }
    },
    []
  );
  const handleScrollFrame = useCallback((values: IPositionValues) => {
    if (values.scrollTop !== 0) {
      wrapperRef.current?.classList.add(styles.scrolled);
    } else {
      wrapperRef.current?.classList.remove(styles.scrolled);
    }
  }, []);
  return (
    <Draggable draggableId={data.id} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div
          className={classnames(styles.wrapper)}
          data-rdb-draggable-index={index}
          ref={(ref) => {
            dragProvided.innerRef(ref);
            wrapperRef.current = ref;
          }}
          {...dragProvided.draggableProps}>
          <Header data={data} dragHandle={dragProvided.dragHandleProps} />
          <Scrollbars
            className={styles.content}
            autoHeightMax={scrollbarMaxHeight}
            autoHeight
            autoHide
            onUpdate={handleScrollFrame}
            onScrollFrame={handleScrollFrame}>
            <Droppable droppableId={data.id} type="CARD">
              {(
                dropProvided: DroppableProvided,
                dropSnapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={dropProvided.innerRef}
                  className={classnames(
                    styles.container,
                    dropSnapshot.isDraggingOver ? styles.draggingOver : ''
                  )}
                  {...dropProvided.droppableProps}>
                  <div className={styles.cardPlaceholder} />
                  {data.cardOrder
                    .filter((cardId) => cardEntities[cardId])
                    .map((cardId, cardIndex) => (
                      <Card
                        data={cardEntities[cardId] as ICard}
                        index={cardIndex}
                        key={cardId}
                      />
                    ))}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </Scrollbars>
          <Footer data={data} onModeChange={handleFooterModeChange} />
        </div>
      )}
    </Draggable>
  );
}

export default memo(Column);
