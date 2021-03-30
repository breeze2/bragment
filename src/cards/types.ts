import type { FormInstance } from 'antd';
import type { ICard, ICardFile } from '../api/types';

export interface ICardSampleViewProps {
  data: ICard;
}

export interface ICreateCardFormItemsProps {
  form: FormInstance<ICreateCardFormFields>;
  submitting: boolean;
  // onSubmit: () => void;
  onSubmit: (fields: ICreateCardFormFields) => void;
}

export interface ICreateCardFormFields {
  title?: string;
  content?: string;
  files?: ICardFile[];
  image?: string;
  link?: string;
  meta?: any;
  tags: string[];
  type: string;
}

export interface ICardComponent {
  readonly type: string;
  readonly initialCreateFormValues?: ICreateCardFormFields;
  readonly messages?: Record<string, Record<string, string>>;
  readonly SampleView: React.ComponentType<ICardSampleViewProps>;
  readonly CreateFormItems?: React.ComponentType<ICreateCardFormItemsProps>;
}
