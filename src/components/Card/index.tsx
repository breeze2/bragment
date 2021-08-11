import { Card as AntdCard } from 'antd';
import { memo, useCallback } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { ICard } from '../../api/database/types';
import { getCardComponent } from '../../cards';
import { cardActions, useReduxDispatch } from '../../redux';
import styles from './index.module.scss';

interface ICardProps {
  data: ICard;
  index: number;
}

function renderContent(data: ICard) {
  const CardComponent = getCardComponent(data.type);
  const SampleView = CardComponent?.SampleView;
  return SampleView ? <SampleView data={data} /> : <>{data.title}</>;
}

function Card(props: ICardProps) {
  const { data, index } = props;
  const dispatch = useReduxDispatch();
  const handleClick = useCallback(
    () => dispatch(cardActions.setCurrentId(data.id)),
    [data, dispatch]
  );

  const content = renderContent(data);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          className={styles.wrapper}
          data-rdb-draggable-index={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <AntdCard hoverable bordered={false} onClick={handleClick}>
            <div className={styles.body}>{content}</div>
          </AntdCard>
        </div>
      )}
    </Draggable>
  );
}

export default memo(Card);
