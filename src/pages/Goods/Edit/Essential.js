import React, { Component, Fragment } from 'react';
import { Card, Button, Input, InputNumber, Form } from 'antd';
import { paraseGoodsClsName } from '@/utils/tools';
const { TextArea } = Input;

@Form.create({
  onValuesChange: (props, value) => {
    props.changeFormInfo(value);
  },
})
class Essential extends Component {
  get goodsClsName() {
    const {
      goodsClsName: { leverOne, leverTwo, leverThree },
    } = this.props;
    const list = [leverOne, leverTwo, leverThree];
    const value = paraseGoodsClsName(list);
    return value.slice(1);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  submit = () => {
    let result = {};
    this.props.form.validateFields((err, values) => {
      if (err) {
        result = false;
      } else {
        result = values;
      }
    });
    return result;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { formInfo } = this.props;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form>
        <Form.Item label="经营类目" {...formItemLayout}>
          {getFieldDecorator('g_class', {
            initialValue: this.goodsClsName || formInfo.gc_name,
          })(<Input style={{ width: 400 }} disabled />)}
          <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.props.nextStep(0)}>
            编辑
          </Button>
        </Form.Item>
        <Form.Item label="商品名称" {...formItemLayout}>
          {getFieldDecorator('goods_name', {
            rules: [
              { required: true, message: '请填写商品名称' },
              { max: 20, message: '商品名称20个字以内' },
            ],
            initialValue: formInfo.goods_name,
          })(<Input style={{ width: 400 }} placeholder="请填写商品名称" />)}
        </Form.Item>

        <Form.Item label="商品描述" {...formItemLayout}>
          {getFieldDecorator('goods_jingle', {
            rules: [
              { required: true, message: '请填写商品描述' },
              {
                max: 100,
                message: '商品描述100个字以内',
              },
            ],
            initialValue: formInfo.goods_jingle,
          })(<TextArea style={{ width: 400 }} rows={4} placeholder="请填写商品描述" />)}
        </Form.Item>

        <Form.Item label="商品价格" {...formItemLayout}>
          {getFieldDecorator('goods_price', {
            rules: [
              { required: true, message: '请填写商品价格' },
              {
                required: false,
                pattern: new RegExp(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, 'g'),
                message: '请输入正确价格',
              },
            ],
            initialValue: formInfo.goods_price,
          })(
            <InputNumber
              style={{ width: 200 }}
              precision={2}
              min={0.01}
              placeholder="请填写商品价格"
            />
          )}
        </Form.Item>
        <Form.Item label="每日限量" {...formItemLayout}>
          {getFieldDecorator('g_storage', {
            rules: [
              {
                required: false,
                pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                message: '请输入整数',
              },
            ],
            initialValue: formInfo.g_storage,
          })(<InputNumber style={{ width: 200 }} precision={0} min={0} placeholder="选填" />)}
        </Form.Item>
      </Form>
    );
  }
}
export default Essential;
