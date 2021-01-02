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
import { ICard, IColumn } from '../../api/types';
import { selectCardEntities, useReduxSelector } from '../../redux';
import { APP_HEADER_HEIGHT } from '../../redux/types';
import styles from '../../styles/Column.module.scss';
import Card from '../Card';
import Footer, { EMode as EFooterMode } from './Footer';
import Header from './Header';

interface IColumnProps {
  data: IColumn;
  index: number;
}

function Column(props: IColumnProps) {
  const { data, index } = props;
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = useState(
    `calc(100vh - ${APP_HEADER_HEIGHT}px - 16px - 48px - 48px - 16px)`
  );
  const cardEntities = useReduxSelector(selectCardEntities);
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
      headerRef.current?.classList.add(styles.hasShadow);
    } else {
      headerRef.current?.classList.remove(styles.hasShadow);
    }
  }, []);
  return (
    <Draggable draggableId={data.id} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div
          className={classnames(
            styles.layout,
            data.cardOrder.length === 0 ? styles.empty : ''
          )}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}>
          <Header
            ref={headerRef}
            data={data}
            dragHandle={dragProvided.dragHandleProps}
          />
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
