import { Icon, Layout, Menu } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { EAppPages } from '../../redux/types';

const Navigator: React.FC = React.memo(() => {
  const { formatMessage: f } = useIntl();
  return (
    <Layout.Sider theme={'light'}>
      <Menu>
        <Menu.Item key={EAppPages.BOARDS}>
          <Link to="/boards">
            <Icon type="project" />
            {f({ id: 'boards' })}
          </Link>
        </Menu.Item>
        <Menu.Item key={EAppPages.SETTINGS}>
          <Link to="/settings">
            <Icon type="setting" />
            {f({ id: 'settings' })}
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
});

export default Navigator;
