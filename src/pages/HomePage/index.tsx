import { Layout } from 'antd';
import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import styles from '../../styles/HomePage.module.scss';
import BoardsPage from './BoardsPage';
import SettingsPage from './SettingsPage';

function HomePage() {
  return (
    <Layout className={styles.layout}>
      <Navigator />
      <Layout>
        <Header />
        <Switch>
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path={['/boards', '/']} component={BoardsPage} />
        </Switch>
      </Layout>
    </Layout>
  );
}

export default memo(HomePage);
