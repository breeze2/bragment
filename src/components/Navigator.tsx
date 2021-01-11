import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { EAppRoute } from '../redux/types';
import styles from '../styles/Navigator.module.scss';

function Navigator() {
  const { formatMessage: f } = useIntl();
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
          <Link to={EAppRoute.BOARDS}>{f({ id: 'boards' })}</Link>
        </Menu.Item>
        <Menu.Item key={EAppRoute.SETTINGS} icon={<SettingOutlined />}>
          <Link to={EAppRoute.SETTINGS}>{f({ id: 'settings' })}</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default memo(Navigator);
