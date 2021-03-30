import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { memo, useEffect, useRef } from 'react';
import { useFormatMessage } from '../../../components/hooks';
import { ICreateCardFormItemsProps } from '../../types';
import FileField from '../FileField';
import styles from '../index.module.scss';
import { CARD_TYPE } from '../types';

function FormItems(props: ICreateCardFormItemsProps) {
  const { form, submitting, onSubmit } = props;
  const f = useFormatMessage();
  const titleInputRef = useRef<Input>(null);

  const handleClick = () => {
    const fields = form.getFieldsValue();
    const title = (fields.title || '').trim();
    const files = (fields.files || [])
      .map((file) => ({
        name: file.name.trim(),
        content: file.content.trim(),
      }))
      .filter((file) => file.name && file.content);

    if (!title) {
      message.error(f('gistTitleIsRequired'));
      return;
    }
    if (!files || !files.every((file) => !!file.content)) {
      message.error(f('gistFileContentIsRequired'));
      return;
    }
    onSubmit(fields);
  };

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  return (
    <>
      <Form.Item name="type" hidden={true}>
        <Input type="hidden" readOnly value={CARD_TYPE} />
      </Form.Item>
      <Form.Item name="title" className={styles.titleField}>
        <Input
          ref={titleInputRef}
          bordered={false}
          prefix={<FormOutlined />}
          placeholder={f('addGistTitle')}
          size="large"
        />
      </Form.Item>
      <Form.List name="files">
        {(fields, { add, remove }) => {
          return (
            <div className={styles.fileFields}>
              {fields.map((field) => (
                <FileField
                  key={field.key}
                  field={field}
                  deletable={fields.length > 1}
                  onDelete={() => remove(field.name)}
                />
              ))}
              <div className={styles.actions}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                />
                <Button
                  type="primary"
                  className={styles.submit}
                  loading={submitting}
                  onClick={handleClick}>
                  {f('createGistCard')}
                </Button>
              </div>
            </div>
          );
        }}
      </Form.List>
    </>
  );
}

export default memo(FormItems);
