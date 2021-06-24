import { DraggableLocation } from 'react-beautiful-dnd';

import cardStyles from '../../components/Card/index.module.scss';
import columnStyles from '../../components/Column/index.module.scss';
import {
  APP_HEADER_HEIGHT,
  COLUMN_CONTENT_PADDING_TOP,
  COLUMN_WIDTH,
} from '../../redux/types';
import styles from './index.module.scss';

export function getColumnPlaceholder() {
  return document.querySelector<HTMLDivElement>(`.${styles.columnPlaceholder}`);
}

export function getColumnWrapper(index: number) {
  return document.querySelector<HTMLDivElement>(
    `.${columnStyles.wrapper}[data-rdb-draggable-index="${index}"]`
  );
}

export function getColumnWrapperId(index: number) {
  const div = getColumnWrapper(index);
  return div?.dataset.rbdDraggableId;
}

export function getColumnContainer(droppableId: string) {
  return document.querySelector<HTMLDivElement>(
    `.${columnStyles.container}[data-rbd-droppable-id="${droppableId}"]`
  );
}

export function getAllCardPlaceholders() {
  return document.querySelectorAll<HTMLDivElement>(
    `.${columnStyles.cardPlaceholder}`
  );
}

export function getCardPlaceholder(droppableId: string) {
  return document.querySelector<HTMLDivElement>(
    `.${columnStyles.container}[data-rbd-droppable-id="${droppableId}"] .${columnStyles.cardPlaceholder}`
  );
}

export function getAllCardWrappersInColumnContainer(container: HTMLDivElement) {
  return container.querySelectorAll<HTMLDivElement>(`.${cardStyles.wrapper}`);
}

export function getCardWrapperInColumnContainer(
  container: HTMLDivElement,
  index: number
) {
  return container.querySelector<HTMLDivElement>(
    `.${cardStyles.wrapper}[data-rdb-draggable-index="${index}"]`
  );
}

export function getCardWrapperId(droppableId: string, index: number) {
  const container = getColumnContainer(droppableId);
  const div = container
    ? getCardWrapperInColumnContainer(container, index)
    : undefined;
  return div?.dataset.rbdDraggableId;
}

export function getColumnHeight(column: HTMLDivElement) {
  const height = Array.prototype.reduce.call(
    column.children,
    (prev, el) => prev + el.offsetHeight,
    0
  );
  return (height || column.offsetHeight || 0) as number;
}

export function makeColumnPlaceholderStyle(
  from: DraggableLocation,
  to: DraggableLocation
) {
  const fromIndex = from.index;
  const toIndex = to.index;
  const fromColumn = getColumnWrapper(fromIndex);
  if (fromColumn) {
    const style = `display: block; height: ${getColumnHeight(
      fromColumn
    )}px; left: ${COLUMN_WIDTH * toIndex + 16 * toIndex + 16}px; top: ${
      16 + APP_HEADER_HEIGHT
    }px`;
    return style;
  }
}

export function makeCardPlaceholderStyle(
  from: DraggableLocation,
  to: DraggableLocation
) {
  const fromColumnContainer = getColumnContainer(from.droppableId);
  const toColumnContainer =
    to.droppableId === from.droppableId
      ? fromColumnContainer
      : getColumnContainer(to.droppableId);
  if (fromColumnContainer && toColumnContainer) {
    const toCards = getAllCardWrappersInColumnContainer(toColumnContainer);
    const fromCard = getCardWrapperInColumnContainer(
      fromColumnContainer,
      from.index
    );
    if (fromCard) {
      let top = Array.prototype.slice
        .call(toCards, 0, to.index)
        .reduce((value, card) => {
          return value + card.offsetHeight + 8;
        }, 0);
      if (to.droppableId === from.droppableId && to.index > from.index) {
        top -= toCards[from.index].offsetHeight + 8;
        top += toCards[to.index].offsetHeight + 8;
      }
      const style = `display: block; height: ${
        fromCard.offsetHeight
      }px; position: absolute; top: ${
        top + COLUMN_CONTENT_PADDING_TOP
      }px; left: 8px`;
      return style;
    }
  }
}
