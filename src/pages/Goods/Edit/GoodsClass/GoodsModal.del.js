import React, { Component } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { deepCopy } from '@/utils/tools';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18, offset: 0 },
};
class GoodsModal extends Component {
  state = {
    //
  };
  initState = (_props = null) => {
    const props = _props || this.porps
    const { item, index } = props;
    const result = deepCopy(item)
    this.setState({
      item: result,
      boxList: result.boxList,
      index
    })
  }

  componentWillReceiveProps(props) {
    const { item, index } = props;
    if (!item.isModal) return;
    this.initState(props)
  }
  componentWillMount() {
    this.initState(this.props)
  }
  changeName = value => {
    const { item } = this.state;
    this.setState({
      item: { ...item, name: value },
    });
  };
  changeBoxVal = (e, index) => {
    const boxList = [...this.state.boxList];
    boxList[index].value = e.target.value;
    this.setState({
      boxList,
    });
  };
  validName = () => {
    const { item, index } = this.state;
    const newName = item.name.trim();

    const list = [...this.props.list];
    list.splice(index, 1);
    const result = list.find(_ => _.name === newName);
    const reg = /^[\u4e00-\u9fa5]+$/;
    if (!reg.test(newName) || newName.length > 4) {
      this.setState({
        item: {
          ...item,
          name: newName,
          validateStatus: 'error',
          err: '请输入正确的商品属性名称，不超过4个汉字',
        },
      });
      return false;
    }
    if (result) {
      this.setState({
        item: {
          ...item,
          name: newName,
          validateStatus: 'error',
          err: '商品属性名称不能重复',
        },
      });
      return false;
    }
    this.setState({
      item: { ...item, name: newName, validateStatus: "success", err: '' }
    });
    return true;
  };
  validBoxList = () => {
    const boxList = [...this.state.boxList];
    const list = [];
    for (const _item of boxList) {
      const value = _item.value.trim();
      if (!value) {
        _item.validateStatus = 'error';
        _item.err = '请填写正确的规格属性';
        continue;
      }
      if (list.find(_ => _ === value)) {
        _item.validateStatus = 'error';
        _item.err = '规格属性不能重复';
        continue;
      }
      list.push(value);
      _item.validateStatus = 'success';
      _item.err = '';
      _item.value = value;
    }
    this.setState({
      boxList: boxList
    });
    return boxList.length === list.length;
  };
  onOk = () => {
    const noError = [this.validName(), this.validBoxList()].every(_ => _ === true);
    if (!noError) {
      notification.error({
        message: '填写错误',
        description: '请重新检查',
      });
      return;
    }
    const boxList = [...this.state.boxList.map(_ => ({ value: _.value, checked: _.checked }))]
    const item = { ...this.state.item }
    const data = { name: item.name, isInput: item.isInput, isModal: false, val: "", boxList }
    this.props.changeList(data, this.state.index)
  };
  render() {
    const { item, boxList } = this.state;
    return (
      <Modal
        title="编辑商品规格属性"
        visible={this.props.item.isModal}
        onCancel={() => this.props.onCancel()}
        onOk={this.onOk}
      >
        <Form.Item
          label="商品属性名称"
          {...formItemLayout}
          validateStatus={item.validateStatus}
          help={item.err}
        >
          <Input
            placeholder="请填写商品名称 , 不超过4个汉字"
            value={item.name}
            onChange={e => this.changeName(e.target.value)}
          />
        </Form.Item>
        {boxList.map((_, key) => {
          return (
            <Form.Item
              key={key}
              label={`商品属性规格${key}`}
              {...formItemLayout}
              validateStatus={_.validateStatus}
              help={_.err}
            >
              <Input
                placeholder="请填写商品属性规格"
                value={_.value}
                onChange={e => this.changeBoxVal(e, key)}
              />
            </Form.Item>
          );
        })}
      </Modal>
    );
  }
}
export default GoodsModal;
