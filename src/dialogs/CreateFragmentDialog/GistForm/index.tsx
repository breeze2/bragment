import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { memo, Suspense } from 'react';
import { useIntl } from 'react-intl';
import GistFormContentSkeleton from '../../../skeletons/GistFormContentSkeleton';
import styles from '../../../styles/CreateFragmentDialog.module.scss';

const GistFileField = React.lazy(() => import('./FileField'));

interface IGistFormData {
  title?: string;
  files?: {
    name?: string;
    content?: string;
  }[];
}

function CreateFragmentDialog() {
  const [form] = Form.useForm<IGistFormData>();
  const { formatMessage: f } = useIntl();
  const handleSubmit = () => {};

  React.useLayoutEffect(() => {
    const files: IGistFormData['files'] = form.getFieldValue('files');
    if (!files || !files.length) {
      form.setFields([{ name: 'files', value: [{ name: '', content: '' }] }]);
    }
  }, [form]);
  return (
    <Form className={styles.form} form={form} name="create-gist">
      <Form.Item name="title" className={styles.title}>
        <Input
          bordered={false}
          placeholder={f({ id: 'addGistTitle' })}
          size="large"
        />
      </Form.Item>
      <Form.List name="files">
        {(fields, { add, remove }) => {
          return (
            <div className={styles.content}>
              <Suspense fallback={<GistFormContentSkeleton />}>
                {fields.map((field) => (
                  <GistFileField
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
                    onClick={handleSubmit}>
                    {f({ id: 'createGistCard' })}
                  </Button>
                </div>
              </Suspense>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
}

export default memo(CreateFragmentDialog);
