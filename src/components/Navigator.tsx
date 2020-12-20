import { ProjectOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { memo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { EAppRoute } from '../redux/types';

function Navigator() {
  const { formatMessage: f } = useIntl();
  const location = useLocation();
  return (
    <Layout.Sider theme={'light'}>
      <Menu
        selectedKeys={[
          location.pathname === EAppRoute.HOME
            ? EAppRoute.BOARDS
            : location.pathname,
        ]}>
        <Menu.Item key={EAppRoute.BOARDS}>
          <Link to={EAppRoute.BOARDS}>
            <ProjectOutlined />
            {f({ id: 'boards' })}
          </Link>
        </Menu.Item>
        <Menu.Item key={EAppRoute.SETTINGS}>
          <Link to={EAppRoute.SETTINGS}>
            <SettingOutlined />
            {f({ id: 'settings' })}
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default memo(Navigator);
