import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector } from 'react-redux';
import { IFragmentCard, IFragmentColumn } from '../../api/types';
import { IReduxState } from '../../redux/types';
import FragmentCard from '../FragmentCard';
import Footer, { EMode as EFooterMode } from './Footer';
import Header from './Header';

import styles from '../../styles/FragmentColumn.module.scss';

interface IFragmentColumnProps {
  data: IFragmentColumn;
  index: number;
}

const FragmentColumn: React.FC<IFragmentColumnProps> = React.memo((props) => {
  const { data, index } = props;
  const [scrollbarMaxHeight, setScrollbarMaxHeight] = React.useState(
    'calc(100vh - 192px)'
  );
  const cardMap = useSelector(
    (reduxState: IReduxState) => reduxState.fragment.cardMap
  );
  const handleFooterModeChange = (mode: EFooterMode) => {
    if (mode === EFooterMode.LABEL) {
      setScrollbarMaxHeight('calc(100vh - 192px)');
    } else {
      setScrollbarMaxHeight('calc(100vh - 232px)');
    }
  };
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
          </Scrollbars>
          <Footer data={data} onModeChange={handleFooterModeChange} />
        </div>
      )}
    </Draggable>
  );
});

export default FragmentColumn;
