import React, { memo, useCallback, useState } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { IFragmentCard, IFragmentColumn } from '../../api/types';
import { selectFragmentCardEntities, useReduxSelector } from '../../redux';
import styles from '../../styles/FragmentColumn.module.scss';
import FragmentCard from '../FragmentCard';
import Footer, { EMode as EFooterMode } from './Footer';
import Header from './Header';

interface IFragmentColumnProps {
  data: IFragmentColumn;
  index: number;
}

function FragmentColumn(props: IFragmentColumnProps) {
  const { data, index } = props;
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = useState(
    'calc(100vh - 192px)'
  );
  const cardEntities = useReduxSelector(selectFragmentCardEntities);
  const handleFooterModeChange = useCallback(
    (mode: EFooterMode, clientHeight?: number) => {
      if (mode === EFooterMode.TEXT) {
        setScrollbarMaxHeight('calc(100vh - 144px - 48px)');
      } else {
        setScrollbarMaxHeight(`calc(100vh - 144px - ${clientHeight || 88}px)`);
      }
    },
    []
  );
  return (
    <Draggable draggableId={data.id} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <div
          className={`${styles.layout} ${
            data.cardOrder.length === 0 ? styles.empty : ''
          }`}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}>
          <Header data={data} dragHandle={dragProvided.dragHandleProps} />
          <Scrollbars
            className={styles.content}
            autoHeightMax={scrollbarMaxHeight}
            autoHeight
            autoHide>
            <Droppable droppableId={data.id} type="CARD">
              {(
                dropProvided: DroppableProvided,
                dropSnapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={dropProvided.innerRef}
                  className={`${styles.container} ${
                    dropSnapshot.isDraggingOver ? styles.draggingOver : ''
                  }`}
                  {...dropProvided.droppableProps}>
                  <div className={styles.cardPlaceholder} />
                  {data.cardOrder
                    .filter((cardId) => cardEntities[cardId])
                    .map((cardId, cardIndex) => (
                      <FragmentCard
                        data={cardEntities[cardId] as IFragmentCard}
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

export default memo(FragmentColumn);
