import { ProjectOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { memo, useState } from 'react';
import { getCardComponent } from '../../cards';
import { ICreateCardFormFields } from '../../cards/types';
import {
  cardActions,
  cardThunks,
  selectCreateCardAsType,
  selectCreateCardForColumn,
  selectCurrentColumnList,
  useReduxAsyncDispatch,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import { COLUMN_WIDTH } from '../../redux/types';
import styles from './index.module.scss';

interface ICreateCardFormProps {
  onFinish: () => void;
}

function CreateCardForm(props: ICreateCardFormProps) {
  const { onFinish } = props;
  const dispatch = useReduxDispatch();
  const asyncDispatch = useReduxAsyncDispatch();
  const cardType = useReduxSelector(selectCreateCardAsType);
  const columnList = useReduxSelector(selectCurrentColumnList);
  const createForColumn = useReduxSelector(selectCreateCardForColumn);

  const [form] = Form.useForm<ICreateCardFormFields>();
  const [submitting, setSubmitting] = useState(false);
  const CardComponent = getCardComponent(cardType);
  const initialFormValues = CardComponent?.initialCreateFormValues;
  const CreateFormItems = CardComponent?.CreateFormItems;

  const handleColumnChange = (columnId: string) => {
    dispatch(cardActions.setCreateForColumnId(columnId));
  };
  const handleSubmit = (fields: ICreateCardFormFields) => {
    if (!createForColumn) {
      return;
    }
    setSubmitting(true);
    asyncDispatch(
      cardThunks.create({
        boardId: createForColumn.boardId,
        columnId: createForColumn.id,
        ...fields,
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
              value={createForColumn?.id}
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
      {CreateFormItems && (
        <CreateFormItems
          form={form}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </Form>
  );
}

export default memo(CreateCardForm);
