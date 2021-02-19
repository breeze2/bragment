import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { EAppRoute } from '../../redux/types';
import { useFormatMessage } from '../hooks';
import styles from './index.module.scss';

function Navigator() {
  const f = useFormatMessage();
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const handleCollapse = (flag: boolean) => {
    setCollapsed(flag);
  };
  return (
    <Layout.Sider
      theme={'light'}
      className={styles.wrapper}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}>
      <Menu
        selectedKeys={[
          location.pathname === EAppRoute.HOME
            ? EAppRoute.BOARDS
            : location.pathname,
        ]}>
        <Menu.Item key={EAppRoute.BOARDS} icon={<AppstoreOutlined />}>
          <Link to={EAppRoute.BOARDS}>{f('boards')}</Link>
        </Menu.Item>
        <Menu.Item key={EAppRoute.SETTINGS} icon={<SettingOutlined />}>
          <Link to={EAppRoute.SETTINGS}>{f('settings')}</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default memo(Navigator);
