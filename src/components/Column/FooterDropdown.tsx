import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ECardType } from '../../api/types';
import { cardActions, useReduxDispatch } from '../../redux';

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
  const { formatMessage: f } = useIntl();

  const handleMenuItemClick = useCallback(
    (type: ECardType) => {
      dispatch(cardActions.showCreateDialog(columnId, ECardType.GIST));
    },
    [columnId, dispatch]
  );
  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          onClick={handleMenuItemClick.bind(undefined, ECardType.GIST)}>
          {f({ id: 'addGistCard' })}
        </Menu.Item>
      </Menu>
    ),
    [f, handleMenuItemClick]
  );
  return (
    <Dropdown trigger={['hover']} overlay={menu}>
      <div>
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
}

export default memo(ColumnFooterDropdown);
