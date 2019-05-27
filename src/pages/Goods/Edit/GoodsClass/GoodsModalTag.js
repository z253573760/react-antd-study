import React from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { editSpecifiName } from '@/services/goods';
class TagModal extends React.Component {
  state = {
    name: '',
    validateStatus: 'success',
    err: '',
  };
  componentWillReceiveProps(props) {
    const { name, isShow } = props;
    if (!isShow) return;
    this.setState({ name, validateStatus: 'success', err: '' });
  }
  changeName = value => {
    this.setState({
      name: value,
    });
  };
  valid = () => {
    //
    const newName = this.state.name.trim();
    if (!newName) {
      this.setState({
        validateStatus: 'error',
        err: '商品属性名称不能为空',
      });
      return false;
    }
    const tagList = [...this.props.tagList];
    const { tagIndex } = this.props;
    tagList.splice(tagIndex, 1);
    const list = tagList.find(_ => _.value === newName);
    if (list !== undefined) {
      this.setState({
        validateStatus: 'error',
        err: '商品属性名称不能重复',
      });
      return false;
    }
    this.setState({
      validateStatus: 'success',
      err: '',
    });
    return true;
  };

  onOk = async () => {
    if (!this.valid()) return;
    const newName = this.state.name;
    const { tagIndex, listIndex, tagList } = this.props;
    const {
      datas: { res },
      code,
    } = await editSpecifiName({
      name: newName,
      spi_val_id: tagList[tagIndex].spi_val_id,
    });
    if (code !== 200) {
      notification.error({
        message: '修改失败',
        description: '请求接口错误',
      });
      return;
    }
    if (res !== 1) {
      notification.error({
        message: '修改失败',
        description: '请求接口错误',
      });
      return;
    }
    this.props.changeTagList(newName, tagIndex, listIndex);
  };
  render() {
    const { props, state } = this;
    return (
      <Modal
        title="编辑商品标签"
        visible={this.props.isShow}
        onCancel={() => this.props.changeShowModalTag()}
        onOk={this.onOk}
      >
        <Form.Item
          label=""
          // {...formItemLayout}
          validateStatus={state.validateStatus}
          help={state.err}
        >
          <Input
            placeholder="请填写商品名称 , 不超过4个汉字"
            value={state.name}
            onChange={e => this.changeName(e.target.value)}
          />
        </Form.Item>
      </Modal>
    );
  }
}

export default TagModal;
