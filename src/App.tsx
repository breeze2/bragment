import React, { memo, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SignInDialog from './dialogs/SignInDialog';
import { defaultLanguage, messages } from './locales';
import BoardPage from './pages/BoardPage';
import HomePage from './pages/HomePage';
import { asyncFetchBoardBgImages } from './redux/actions';
import { IReduxState } from './redux/types';

function App() {
  const language = useSelector((state: IReduxState) => state.common.language);
  const dispatch = useDispatch();
  useEffect(() => {
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
      <SignInDialog />
    </IntlProvider>
  );
}

export default memo(App);
