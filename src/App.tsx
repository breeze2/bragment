import React from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { defaultLanguage, messages } from './locales';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import { asyncFetchBoardBgImages } from './redux/actions';
import { IReduxState } from './redux/types';

const App: React.FC = () => {
  const language = useSelector((state: IReduxState) => state.common.language);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(asyncFetchBoardBgImages());
  }, [dispatch]);
  return (
    <IntlProvider
      locale={language}
      messages={messages[language] || messages[defaultLanguage]}>
      <Switch>
        <Route exact path="/board/:id" component={BoardPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </IntlProvider>
  );
};

export default App;
