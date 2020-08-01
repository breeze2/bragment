import React, { memo, useCallback } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { IFragmentCard, IFragmentColumn } from '../../api/types';
import { IReduxState } from '../../redux/types';
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
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = React.useState(
    'calc(100vh - 192px)'
  );
  const cardMap = useSelector(
    (reduxState: IReduxState) => reduxState.fragment.cardMap
  );
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
          <Droppable droppableId={data.id} type="CARD">
            {(
              dropProvided: DroppableProvided,
              dropSnapshot: DroppableStateSnapshot
            ) => (
              <div
                ref={dropProvided.innerRef}
                style={{ maxHeight: scrollbarMaxHeight }}
                className={`${styles.container} ${
                  dropSnapshot.isDraggingOver ? styles.draggingOver : ''
                }`}
                {...dropProvided.droppableProps}>
                <div className={styles.cardPlaceholder} />
                {data.cardOrder
                  .filter((cardId) => cardMap.has(cardId))
                  .map((cardId, cardIndex) => (
                    <FragmentCard
                      data={cardMap.get(cardId) as IFragmentCard}
                      index={cardIndex}
                      key={cardId}
                    />
                  ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
          <Footer data={data} onModeChange={handleFooterModeChange} />
        </div>
      )}
    </Draggable>
  );
}

export default memo(FragmentColumn);
