import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { ECardComponentFilter, getCardComponentTypes } from '../../cards';

import { cardActions, useReduxDispatch } from '../../redux';
import { useFormatMessage } from '../hooks';

export enum EMode {
  INPUT,
  TEXT,
}

interface IColumnFooterDropdownProps {
  columnId: string;
}

function ColumnFooterDropdown(props: IColumnFooterDropdownProps) {
  const { columnId } = props;
  const dispatch = useReduxDispatch();
  const f = useFormatMessage();

  const handleMenuItemClick = useCallback(
    (type: string) => {
      dispatch(cardActions.showCreateDialog(columnId, type));
    },
    [columnId, dispatch]
  );
  const menu = useMemo(() => {
    const types = getCardComponentTypes(
      ECardComponentFilter.HAS_CREATE_FROM_ITEMS
    );
    return (
      <Menu>
        {types.map((type) => (
          <Menu.Item
            onClick={handleMenuItemClick.bind(undefined, type)}
            key={type}>
            {f('addGistCard')}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [f, handleMenuItemClick]);
  return (
    <Dropdown trigger={['hover']} overlay={menu}>
      <div>
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
}

export default memo(ColumnFooterDropdown);
