import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import BoardsRoute from './BoardsRoute';
import SettingsRoute from './SettingsRoute';

function HomePage() {
  return (
    <Switch>
      <Route exact path="/settings" component={SettingsRoute} />
      <Route exact path={['/boards', '/']} component={BoardsRoute} />
    </Switch>
  );
}

export default memo(HomePage);
