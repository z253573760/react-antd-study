import React, { Component, Fragment } from 'react';
import { getGoodsClass } from '@/services/goods';
import { Form, Select, Radio, DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  return current && current <= moment().subtract(1, 'day');
}

function disabledHours() {
  const arr = range(0, 24);
  let hour = new Date().getHours();
  const min = new Date().getMinutes();
  if (min >= 30) {
    hour += 1;
  }
  arr.splice(new Date().getHours(), 24);
  return arr;
}

@Form.create({})
class Other extends Component {
  state = {
    goodsClassList: [],
    g_state: 1,
    date: '',
    time: '',
    errDateTxt: '',
    errDateStatus: 'success',
    sgcate_id: '',
    goods_commend: 1,
  };
  async getGoodsClass() {
    const { datas } = await getGoodsClass();
    this.setState({
      goodsClassList: datas,
    });
  }
  async componentWillMount() {
    this.props.onRef(this);
    await this.getGoodsClass();
  }
  componentWillReceiveProps(nextProps) {
    const { sgcate_id, goods_commend } = nextProps;
    this.setState({ sgcate_id, goods_commend });
  }
  onChangeDate = (date, dateString) => {
    this.setState({
      date: dateString,
    });
  };
  onChangeTime = (date, dateString) => {
    this.setState({
      time: dateString,
    });
  };
  validDate() {
    const { getFieldsValue } = this.props.form;
    const { date, time } = this.state;
    const { g_state } = getFieldsValue();
    if (g_state) return true;
    if (!date || !time) {
      this.setState({
        errDateTxt: '请选择发布时间',
        errDateStatus: 'error',
      });
      return;
    }
    const resultDateStr = `${date} ${time}`; //starttime + starttime_H;
    const resultDate = new Date(resultDateStr);
    const nowTime = new Date();
    if (resultDate * 1000 - nowTime * 1000 < 60 * 1000) {
      this.setState({
        errDateTxt: '发布时间需晚于当前时间',
        errDateStatus: 'error',
      });
      return;
    }
    this.setState({
      errDateTxt: '',
      errDateStatus: 'success',
    });
    return true;
  }
  valid = () => {
    const { validateFields } = this.props.form;
    let isValid = true;
    validateFields((err, values) => {
      if (err) {
        isValid = false;
      }
    });
    return isValid;
  };
  submit = () => {
    const { getFieldsValue } = this.props.form;
    const { date, time } = this.state;
    const isValid = [this.validDate(), this.valid()].every(_ => _ === true);
    if (!isValid) {
      return false;
    }
    return {
      ...getFieldsValue(),
      starttime: date || undefined,
      starttime_H: time.split(':')[0] || undefined,
      starttime_i: time.split(':')[1],
    };
  };
  render() {
    const { goods_commend } = this.props;
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { goodsClassList, errDateStatus, errDateTxt, sgcate_id } = this.state;
    const { g_state } = getFieldsValue();
    return (
      <Form>
        {this.show}
        <Form.Item label="商品分类" {...formItemLayout}>
          {getFieldDecorator('sgcate_id', {
            initialValue: sgcate_id,
            rules: [
              {
                required: true,
                message: '请选择商品分类',
              },
            ],
          })(
            <Select style={{ width: 200 }} placeholder="请选择商品分类">
              {goodsClassList.map(_ => (
                <Option key={_.stc_id} value={_.stc_id}>
                  {_.stc_name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="发布时间" {...formItemLayout}>
          {getFieldDecorator('g_state', {
            initialValue: 1,
          })(
            <RadioGroup>
              <Radio value={1}>立即发布</Radio>
              <Radio value={0}>发布时间</Radio>
            </RadioGroup>
          )}
          <Form.Item
            style={{ marginLeft: 200, marginTop: -38 }}
            validateStatus={errDateStatus}
            help={errDateTxt}
          >
            <DatePicker
              disabled={!!g_state}
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              onChange={this.onChangeDate}
              disabledDate={disabledDate}
            />
            <TimePicker
              disabled={!!g_state}
              format="HH:mm"
              minuteStep={30}
              format="HH:mm"
              disabledHours={() => disabledHours()}
              onChange={this.onChangeTime}
              hideDisabledOptions={true}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="是否推荐" {...formItemLayout} style={{ marginTop: -24 }}>
          {getFieldDecorator('g_commend', { initialValue: goods_commend })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Other;
