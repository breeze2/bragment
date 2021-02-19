import {
  FormOutlined,
  PlusOutlined,
  ProjectOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { lazy, memo, Suspense, useMemo, useRef, useState } from 'react';
import { ECardType, ICardFile, IColumn } from '../../../api/types';
import { useFormatMessage } from '../../../components/hooks';
import { cardThunks, useReduxAsyncDispatch } from '../../../redux';
import { COLUMN_WIDTH } from '../../../redux/types';
import GistFormContentSkeleton from '../../../skeletons/GistFormContentSkeleton';
import styles from '../index.module.scss';

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
  const f = useFormatMessage();
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
      message.error(f('gistTitleIsRequired'));
      return;
    }
    if (!files || !files.every((file) => !!file.content)) {
      message.error(f('gistFileContentIsRequired'));
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
      <Form.Item className={styles.columnField}>
        <ProjectOutlined className={styles.columnFieldIcon} />
        <Row>
          <Col flex="1 1 auto">
            <Select
              bordered={false}
              dropdownMatchSelectWidth={COLUMN_WIDTH}
              value={selectedColumn?.id}
              onChange={handleColumnChange}>
              {columnList.map((column) => (
                <Select.Option key={column.id} value={column.id}>
                  {column.title}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col flex="0 0 auto">
            <Space align="center">
              <Button type="text" icon={<TagsOutlined />} />
            </Space>
          </Col>
        </Row>
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
                    {f('createGistCard')}
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
