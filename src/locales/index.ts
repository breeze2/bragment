import enUS from './en-US';
import zhCN from './zh-CN';

export const defaultLanguage = 'en-US';

export const messages: {
  [key: string]: Record<string, string> | Record<string, any[]>;
} = {
  'en-US': enUS,
  'zh-CN': zhCN,
};
