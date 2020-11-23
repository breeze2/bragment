import {
  GlobalOutlined,
  LockOutlined,
  PictureOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { memo, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { EBoardPolicy, EBoardType, IBoard } from '../../api/types';
import { boardThunks, useReduxAsyncDispatch } from '../../redux';
import styles from '../../styles/CreateBoardDialog.module.scss';
import { preloadImage } from '../../utils';
import BackgroundPopover, { ISelectedBackground } from './BackgroundPopover';

interface IBoardFormData {
  title: string;
  groupId: string;
  policy: EBoardPolicy;
}

interface IBoardFormProps {
  background: ISelectedBackground;
  onFinish?: () => void;
  onBackgroundChange?: (bg: ISelectedBackground) => void;
}

function BoardForm(props: IBoardFormProps) {
  const { background, onFinish, onBackgroundChange } = props;
  const { formatMessage: f } = useIntl();
  const [form] = Form.useForm<IBoardFormData>();
  const [submitting, setSubmitting] = useState(false);
  const asyncDispatch = useReduxAsyncDispatch();
  const initialFormValues = useMemo<IBoardFormData>(
    () => ({
      title: '',
      groupId: EBoardType.PERSONAL,
      policy: EBoardPolicy.PRIVATE,
    }),
    []
  );

  const backgroundPopover = useMemo(
    () => (
      <BackgroundPopover value={background} onChange={onBackgroundChange}>
        <div className={styles.bgSelect}>
          <PictureOutlined />
        </div>
      </BackgroundPopover>
    ),
    [background, onBackgroundChange]
  );

  const handleSubmit = () => {
    const fields = form.getFieldsValue();
    const personal = fields.groupId === EBoardType.PERSONAL;
    const options: Partial<IBoard> = {};
    if (background.image) {
      options.color = background.image.color;
      options.image = background.image.urls.raw;
      preloadImage(options.image);
    } else if (background.color) {
      options.color = background.color;
    }
    if (!personal) {
      options.groupId = fields.groupId;
    }
    setSubmitting(true);
    asyncDispatch(
      boardThunks.create({
        title: fields.title,
        policy: fields.policy,
        type: personal ? EBoardType.PERSONAL : EBoardType.GROUP,

        ...options,
      })
    )
      .then(() => {
        if (onFinish) {
          onFinish();
        }
        form.resetFields();
      })
      .catch(() => {
        // TODO: alert error message
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Form form={form} initialValues={initialFormValues}>
      <Form.Item
        name="title"
        rules={[{ required: true, message: f({ id: 'requiredEmailTips' }) }]}>
        <Input
          placeholder={f({ id: 'addBoardTitle' })}
          addonAfter={backgroundPopover}
        />
      </Form.Item>
      <Form.Item name="groupId">
        <Select dropdownClassName={styles.dropdown}>
          <Select.Option value={EBoardType.PERSONAL}>
            <UserOutlined />
            {f({ id: 'personal' })}
          </Select.Option>
          <Select.Option value="disabled" disabled>
            <TeamOutlined />
            {f({ id: 'noGroups' })}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="policy">
        <Select dropdownClassName={styles.dropdown}>
          <Select.Option value={EBoardPolicy.PRIVATE}>
            <LockOutlined />
            {f({ id: 'private' })}
          </Select.Option>
          <Select.Option value={EBoardPolicy.PUBLIC}>
            <GlobalOutlined />
            {f({ id: 'public' })}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className={styles.formActions}>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          loading={submitting}>
          {f({ id: 'createBoard' })}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default memo(BoardForm);
