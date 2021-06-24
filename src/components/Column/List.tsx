import { memo } from 'react';
import { a, useTrail } from 'react-spring';
import { IColumn } from '../../api/types';
import { selectColumnEntities, useReduxSelector } from '../../redux';
import Column from './index';

interface IColumnListProps {
  columnIds: string[];
}

function ColumnList(props: IColumnListProps) {
  const { columnIds } = props;
  const columnEntities = useReduxSelector(selectColumnEntities);
  const trail = useTrail(columnIds.length, {
    delay: 120,
    opacity: 1,
    x: '0%',
    y: '0px',
    from: { opacity: 0.5, x: '60%', y: '96px' },
  });
  return (
    <>
      {trail.map((style, index) => {
        const columnId = columnIds[index];
        return (
          <a.div key={columnId} style={style}>
            <Column index={index} data={columnEntities[columnId] as IColumn} />
          </a.div>
        );
      })}
    </>
  );
}

export default memo(ColumnList);
