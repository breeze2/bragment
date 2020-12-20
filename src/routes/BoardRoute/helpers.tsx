import { DraggableLocation } from 'react-beautiful-dnd';

import styles from '../../styles/App.module.scss';
import FragmentCardStyles from '../../styles/FragmentCard.module.scss';
import FragmentColumnStyles from '../../styles/FragmentColumn.module.scss';

export function getColumnPlaceholder() {
  return document.querySelector<HTMLDivElement>(`.${styles.columnPlaceholder}`);
}

export function getColumnWrapper(index: number) {
  return document.querySelector<HTMLDivElement>(
    `.${FragmentColumnStyles.layout}:nth-of-type(${index + 2})`
  );
}

export function getColumnWrapperId(index: number) {
  const div = getColumnWrapper(index);
  return div?.dataset.rbdDraggableId;
}

export function getColumnContainer(droppableId: string) {
  return document.querySelector<HTMLDivElement>(
    `.${FragmentColumnStyles.container}[data-rbd-droppable-id="${droppableId}"]`
  );
}

export function getAllCardPlaceholders() {
  return document.querySelectorAll<HTMLDivElement>(
    `.${FragmentColumnStyles.cardPlaceholder}`
  );
}

export function getCardPlaceholder(droppableId: string) {
  return document.querySelector<HTMLDivElement>(
    `.${FragmentColumnStyles.container}[data-rbd-droppable-id="${droppableId}"] .${FragmentColumnStyles.cardPlaceholder}`
  );
}

export function getAllCardWrappersInColumnContainer(container: HTMLDivElement) {
  return container.querySelectorAll<HTMLDivElement>(
    `.${FragmentCardStyles.wrapper}`
  );
}

export function getCardWrapperInColumnContainer(
  container: HTMLDivElement,
  index: number
) {
  return container.querySelector<HTMLDivElement>(
    `.${FragmentCardStyles.wrapper}:nth-of-type(${index + 2})`
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
    )}px; left: ${266 * toIndex + 16 * toIndex + 16}px; top: 16px`;
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
      let top = Array.prototype.slice.call(toCards, 0, to.index).reduce(
        (value, card) => {
          return value + card.offsetHeight + 8;
        },
        toCards.length === 0 ? 6 : 0
      );
      if (to.droppableId === from.droppableId && to.index > from.index) {
        top -= toCards[from.index].offsetHeight + 8;
        top += toCards[to.index].offsetHeight + 8;
      }
      const style = `display: block; height: ${fromCard.offsetHeight}px; position: absolute; top: ${top}px; left: 8px`;
      return style;
    }
  }
}
