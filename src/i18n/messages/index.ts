import { getAllCardComponentMessages } from '../../cards';
import { ELanguage } from '../types';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

export type ILocalMessages = typeof enUS;
const cardMessages = getAllCardComponentMessages();

const messages: Record<ELanguage, ILocalMessages> = {
  [ELanguage.EN_US]: { ...enUS, ...cardMessages[ELanguage.EN_US] },
  [ELanguage.ZH_CN]: { ...zhCN, ...cardMessages[ELanguage.ZH_CN] },
};

export default messages;
