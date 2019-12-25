import React from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { defaultLanguage, messages } from './locales';
import HomePage from './pages/Home';
import { IReduxState } from './redux/types';

const App: React.FC = () => {
  const language = useSelector((state: IReduxState) => state.common.language);
  return (
    <IntlProvider
      locale={language}
      messages={messages[language] || messages[defaultLanguage]}>
      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
    </IntlProvider>
  );
};

export default App;
