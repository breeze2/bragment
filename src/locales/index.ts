import { IntlConfig } from 'react-intl';
import enUS from './en-US';
import zhCN from './zh-CN';

export const defaultLanguage = 'en-US';

export const messages: {
  [key: string]: IntlConfig['messages'];
} = {
  'en-US': enUS,
  'zh-CN': zhCN,
};
