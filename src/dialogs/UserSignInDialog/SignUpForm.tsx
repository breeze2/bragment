import { LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useReduxAsyncDispatch, userThunks } from '../../redux';
import styles from '../../styles/UserSignInDialog.module.scss';

interface ISignUpFormData {
  email: string;
  password: string;
}

interface ISignUpFormProps {
  onFinish?: () => void;
}

function SignUpForm(props: ISignUpFormProps) {
  const { onFinish } = props;
  const { formatMessage: f } = useIntl();
  const [form] = Form.useForm<ISignUpFormData>();
  const [submitting, setSubmitting] = useState(false);
  const asyncDispatch = useReduxAsyncDispatch();
  const handleSubmit = () => {
    const fields = form.getFieldsValue();
    setSubmitting(true);
    asyncDispatch(userThunks.create(fields))
      .then(() => {
        if (onFinish) {
          onFinish();
        }
        form.resetFields();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: f({ id: 'requiredEmailTips' }) }]}>
        <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: f({ id: 'requiredPasswordTips' }) },
        ]}>
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
          icon={<UserAddOutlined />}
          loading={submitting}
          block>
          {f({ id: 'signUp' })}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default memo(SignUpForm);
