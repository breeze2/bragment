import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select } from 'antd';
import { lazy, memo, Suspense, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { ECardType, ICardFile, IColumn } from '../../../api/types';
import { cardThunks, useReduxAsyncDispatch } from '../../../redux';
import GistFormContentSkeleton from '../../../skeletons/GistFormContentSkeleton';
import styles from '../../../styles/CreateCardDialog.module.scss';

const GistFileField = lazy(() => import('./FileField'));

interface IGistFormData {
  title?: string;
  files?: ICardFile[];
}

interface IGistFormProps {
  columnList: IColumn[];
  selectedColumn?: IColumn;
  onFinish?: () => void;
  onColumnChange?: (columnId: string) => void;
}

function GistForm(props: IGistFormProps) {
  const { columnList, selectedColumn, onColumnChange, onFinish } = props;
  const { formatMessage: f } = useIntl();
  const asyncDispatch = useReduxAsyncDispatch();
  const [form] = Form.useForm<IGistFormData>();
  const [submitting, setSubmitting] = useState(false);
  const titleInputRef = useRef<Input>(null);
  const initialFormValues = useMemo<IGistFormData>(
    () => ({ title: '', files: [{ name: '', content: '' }] }),
    []
  );

  const handleColumnChange = (columnId: string) => {
    if (onColumnChange) {
      onColumnChange(columnId);
    }
  };

  const handleSubmit = () => {
    const fields = form.getFieldsValue();
    const title = (fields.title || '').trim();
    const files = (fields.files || [])
      .map<ICardFile>((file) => ({
        name: file.name.trim(),
        content: file.content.trim(),
      }))
      .filter((file) => file.name && file.content);

    if (!selectedColumn) {
      return;
    }
    if (!title) {
      message.error(f({ id: 'gistTitleIsRequired' }));
      return;
    }
    if (!files || !files.every((file) => !!file.content)) {
      message.error(f({ id: 'gistFileContentIsRequired' }));
      return;
    }
    setSubmitting(true);
    asyncDispatch(
      cardThunks.create({
        boardId: selectedColumn.boardId,
        columnId: selectedColumn.id,
        title,
        files,
        type: ECardType.GIST,
      })
    )
      .catch(() => {
        // TODO: handle EXCEPTION
      })
      .then(() => {
        form.resetFields();
        if (onFinish) {
          onFinish();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Form
      className={styles.form}
      form={form}
      name="create-gist"
      initialValues={initialFormValues}>
      <Form.Item name="title" className={styles.titleField}>
        <Input
          ref={titleInputRef}
          bordered={false}
          placeholder={f({ id: 'addGistTitle' })}
          size="large"
        />
      </Form.Item>
      <Form.Item className={styles.columnField}>
        <Select value={selectedColumn?.id} onChange={handleColumnChange}>
          {columnList.map((column) => (
            <Select.Option key={column.id} value={column.id}>
              {column.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.List name="files">
        {(fields, { add, remove }) => {
          return (
            <div className={styles.fileFields}>
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
                    loading={submitting}
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

export default memo(GistForm);
