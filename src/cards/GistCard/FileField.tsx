import 'file-icons-js/css/style.css';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import classnames from 'classnames';
import { getClassWithColor } from 'file-icons-js';
import { memo, ChangeEvent as ReactChangeEvent, useRef, useState } from 'react';

import { DEFAULT_LANGUAGE, detectLanguageByFileName } from '../../api/editor';
import { useCardFormatMessage } from '../helpers';
import GistCodeEditor from './CodeEditor';
import styles from './index.module.scss';
import { CARD_TYPE, IGistCardFormatMessages } from './types';

export interface IFileFieldProps {
  field: FormListFieldData;
  deletable?: boolean;
  onDelete?: () => void;
}

function FileField(props: IFileFieldProps) {
  const { deletable, field, onDelete } = props;
  const defaultFileIconClassName = 'default-icon dark-blue';
  const f = useCardFormatMessage<IGistCardFormatMessages>(CARD_TYPE);
  const inputRef = useRef<Input>(null);
  const [fileIconClassName, setFileIconClassName] = useState<string>(
    defaultFileIconClassName
  );
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);

  const handleFileNameChange = (event: ReactChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const className = getClassWithColor(value);
    setFileIconClassName(className || defaultFileIconClassName);
    setLanguage(detectLanguageByFileName(value) || DEFAULT_LANGUAGE);
  };
  const handleEmptyExtraClick = () => {
    inputRef.current?.focus();
  };

  return (
    <Card
      className={styles.fileField}
      title={
        <Form.Item
          name={[field.name, 'name']}
          fieldKey={[field.fieldKey, 'name']}>
          <Input
            ref={inputRef}
            bordered={false}
            className={styles.fileNameInput}
            onChange={handleFileNameChange}
            placeholder={f('fileName')}
            prefix={
              <span
                className={classnames(fileIconClassName, styles.fileIcon)}
              />
            }
          />
        </Form.Item>
      }
      extra={
        deletable ? (
          <Button
            onClick={onDelete}
            icon={<DeleteOutlined />}
            type="text"
            danger
          />
        ) : (
          <div className={styles.emptyExtra} onClick={handleEmptyExtraClick} />
        )
      }>
      <Form.Item
        name={[field.name, 'content']}
        fieldKey={[field.fieldKey, 'content']}>
        <GistCodeEditor language={language} />
      </Form.Item>
    </Card>
  );
}

export default memo(FileField);
