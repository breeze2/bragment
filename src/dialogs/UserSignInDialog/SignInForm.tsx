import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useReduxAsyncDispatch, userThunks } from '../../redux';
import styles from '../../styles/UserSignInDialog.module.scss';

interface ISignInFormData {
  email: string;
  password: string;
}

interface ISignInFormProps {
  onFinish?: () => void;
}

function SignInForm(props: ISignInFormProps) {
  const { onFinish } = props;
  const { formatMessage: f } = useIntl();
  const [form] = Form.useForm<ISignInFormData>();
  const [submitting, setSubmitting] = useState(false);
  const asyncDispatch = useReduxAsyncDispatch();
  const handleSubmit = () => {
    const data = form.getFieldsValue();
    const { email, password } = data;
    if (email && password) {
      setSubmitting(true);
      asyncDispatch(userThunks.login(data))
        .then(() => {
          if (onFinish) {
            onFinish();
          }
          form.resetFields();
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="email">
        <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item className={styles.formActions}>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          icon={<LoginOutlined />}
          loading={submitting}
          block>
          {f({ id: 'signIn' })}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default memo(SignInForm);
