import enUS from './en-US.json';
import zhCN from './zh-CN.json';

export type ILocalMessages = typeof enUS;

const messages: Record<string, ILocalMessages> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

export default messages;
