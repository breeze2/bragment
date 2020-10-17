import { ProjectOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { EAppPage } from '../redux/types';

function Navigator() {
  const { formatMessage: f } = useIntl();
  return (
    <Layout.Sider theme={'light'}>
      <Menu>
        <Menu.Item key={EAppPage.BOARDS}>
          <Link to="/boards">
            <ProjectOutlined />
            {f({ id: 'boards' })}
          </Link>
        </Menu.Item>
        <Menu.Item key={EAppPage.SETTINGS}>
          <Link to="/settings">
            <SettingOutlined />
            {f({ id: 'settings' })}
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default memo(Navigator);
