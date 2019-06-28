import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
  },
};
const App = props => {
  const { dispatch, user, form } = props;
  const { getFieldDecorator, validateFields } = form;
  useEffect(() => {
    dispatch({
      type: 'user/getInfo',
    });
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('handleSubmit');
    validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'user/add',
        payload: values,
      });
    });
  }, []);

  return (
    <div style={{ padding: 15 }}>
      <Card>
        <Form
          {...formItemLayout}
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Item label="name">
            {getFieldDecorator('name', {
              initialValue: user.info.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="password">
            {getFieldDecorator('password', {
              initialValue: user.info.password,
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default connect(state => ({
  user: state.user,
}))(Form.create()(App));
