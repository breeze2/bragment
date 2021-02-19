import 'file-icons-js/css/style.css';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import classnames from 'classnames';
import { getClassWithColor } from 'file-icons-js';
import { memo, ChangeEvent as ReactChangeEvent, useState } from 'react';

import {
  DEFAULT_LANGUAGE,
  detectLanguageByFileName,
} from '../../../api/editor';
import { useFormatMessage } from '../../../components/hooks';
import styles from '../index.module.scss';
import GistCodeEditor from './CodeEditor';

export interface IGistFileFieldProps {
  field: FormListFieldData;
  deletable?: boolean;
  onDelete?: () => void;
}

function GistFileField(props: IGistFileFieldProps) {
  const { deletable, field, onDelete } = props;
  const f = useFormatMessage();
  const defaultFileIconClassName = 'default-icon dark-blue';
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

  return (
    <Card
      className={styles.gistFileField}
      title={
        <Form.Item
          name={[field.name, 'name']}
          fieldKey={[field.fieldKey, 'name']}>
          <Input
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
          <span />
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

export default memo(GistFileField);
