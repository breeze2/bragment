import {
  FormOutlined,
  GlobalOutlined,
  LockOutlined,
  PictureOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import classnames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';

import { EBoardPolicy, EBoardType, IBoard } from '../../api/database/types';
import { useFormatMessage } from '../../components/hooks';
import { boardThunks, useReduxAsyncDispatch } from '../../redux';
import { preloadImage } from '../../utils';
import BackgroundPopover, { ISelectedBackground } from './BackgroundPopover';
import styles from './index.module.scss';

interface ICreateBoardFormData {
  title: string;
  groupId: string;
  policy: EBoardPolicy;
}

interface ICreateBoardFormProps {
  background: ISelectedBackground;
  onFinish?: () => void;
  onBackgroundChange?: (bg: ISelectedBackground) => void;
}

function CreateBoardForm(props: ICreateBoardFormProps) {
  const { background, onFinish, onBackgroundChange } = props;
  const f = useFormatMessage();
  const [form] = Form.useForm<ICreateBoardFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [bgPopoverVisible, setBgPopoverVisible] = useState(false);
  const asyncDispatch = useReduxAsyncDispatch();
  const initialFormValues = useMemo<ICreateBoardFormData>(
    () => ({
      title: '',
      groupId: EBoardType.PERSONAL,
      policy: EBoardPolicy.PRIVATE,
    }),
    []
  );

  const handleVisibleChange = useCallback((visible: boolean) => {
    setBgPopoverVisible(visible);
  }, []);
  const bgPopover = useMemo(
    () => (
      <BackgroundPopover
        value={background}
        onChange={onBackgroundChange}
        onVisibleChange={handleVisibleChange}>
        <div className={styles.bgSelect}>
          <PictureOutlined />
        </div>
      </BackgroundPopover>
    ),
    [background, onBackgroundChange, handleVisibleChange]
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
        rules={[{ required: true, message: f('requiredBoardTitleTips') }]}>
        <Input
          className={classnames(bgPopoverVisible && styles.withBgPopover)}
          bordered={false}
          prefix={<FormOutlined />}
          placeholder={f('addBoardTitle')}
          addonAfter={bgPopover}
        />
      </Form.Item>
      <Form.Item name="groupId">
        <Select bordered={false} dropdownClassName={styles.dropdown}>
          <Select.Option value={EBoardType.PERSONAL}>
            <UserOutlined />
            {f('personal')}
          </Select.Option>
          <Select.Option value="disabled" disabled>
            <TeamOutlined />
            {f('noGroups')}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="policy">
        <Select bordered={false} dropdownClassName={styles.dropdown}>
          <Select.Option value={EBoardPolicy.PRIVATE}>
            <LockOutlined />
            {f('private')}
          </Select.Option>
          <Select.Option value={EBoardPolicy.PUBLIC}>
            <GlobalOutlined />
            {f('public')}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className={styles.formActions}>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          loading={submitting}>
          {f('createBoard')}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default memo(CreateBoardForm);
