import { ICardComponent } from '../types';
import CreateFormItems from './CreateFormItems';
import messages from './messages';
import SampleView from './SampleView';
import { CARD_TYPE } from './types';

const type = CARD_TYPE;
const GistCard: ICardComponent = {
  type,
  initialCreateFormValues: {
    title: '',
    files: [{ name: '', content: '' }],
    tags: [],
    type,
  },
  messages,
  CreateFormItems,
  SampleView,
};

export default GistCard;
