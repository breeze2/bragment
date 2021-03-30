import { ICardComponent } from '../types';
import SampleView from './SampleView';
import { CARD_TYPE } from './types';

const type = CARD_TYPE;
const NoteCard: ICardComponent = {
  type,
  SampleView,
};

export default NoteCard;
