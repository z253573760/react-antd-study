import React, { Component, Fragment } from 'react';
import withRouter from 'umi/withRouter';

import { Card, Button, Steps, Select, Row, Col } from 'antd';
import styles from './edit.less';

// api 相关
import { getStepOne } from '@/services/goods';

const Option = Select.Option;
@withRouter
class ChooseTag extends Component {
  state = {
    staple_array: [], //历史记录
    goods_class: [],
    store_class: [], //属性分类 三维数组
    staple_name: '请选择常用分类',
    leverOne: null,
    leverTwo: null,
    leverThree: null,
    // gc_id: 0,
  };
  async getStepOne() {
    //添加商品第一步 选择分类信息
    const {
      datas: { goods_class, staple_array, store_class },
    } = await getStepOne();
    this.setState({
      staple_array,
      goods_class,
      store_class,
    });
  }
  async componentWillMount() {
    await this.getStepOne();
  }
  getClsName(id, _lever) {
    const lever = this.state[_lever];
    if (lever && lever.id === id) {
      return `${styles['class-item']} ${styles['class-item-checked']}`;
    }
    return styles['class-item'];
  }

  handleChange = staple_id => {
    const { staple_array, store_class } = this.state;
    const { gc_id_1, gc_id_2, gc_id_3, staple_name } = staple_array.find(
      _ => _.staple_id === staple_id
    );
    const leverOne = store_class.find(_ => _.id === gc_id_1);
    const leverTwo = leverOne ? leverOne.child.find(_ => _.id === gc_id_2) : null;
    const leverThree = leverTwo ? leverTwo.child.find(_ => _.id === gc_id_3) : null;
    this.setState({
      leverOne,
      leverTwo,
      leverThree,
      staple_name,
      // gc_id: gc_id_3 === 0 ? gc_id_2 : gc_id3,
    });
  };
  changeClassItem = (id, _lever) => {
    const { store_class, leverOne, leverTwo } = this.state;
    if (_lever === 'leverOne') {
      const leverOne = store_class.find(_ => _.id === id);
      this.setState({
        leverOne,
        leverTwo: null,
        staple_name: '',
      });
    }
    if (_lever === 'leverTwo') {
      const leverTwo = leverOne ? leverOne.child.find(_ => _.id === id) : null;
      this.setState({
        leverTwo,
        leverThree: null,
        staple_name: '',
      });
    }
    if (_lever === 'leverThree') {
      const leverThree = leverTwo ? leverTwo.child.find(_ => _.id === id) : null;
      this.setState({
        leverThree,
        staple_name: '',
      });
    }
  };
  nextStep = () => {
    const { leverOne, leverTwo, leverThree } = this.state;
    this.props.nextStep();
    this.props.changeGoodsClsName({ leverOne, leverTwo, leverThree });
  };
  get disabled() {
    const { leverOne, leverTwo, leverThree } = this.state;
    if (!leverOne) return true; // 判断一级栏目
    if (leverOne.child.length && !leverTwo) return true; // 判断二级栏目
    if (leverTwo.child.length && !leverThree) return true; // 判断三级栏目
    return false;
  }
  render() {
    const { staple_array, staple_name, store_class, leverOne, leverTwo } = this.state;

    return (
      <div className={styles['step-one']}>
        <Card title="经营类目">
          <Select
            onChange={this.handleChange}
            value={staple_name}
            style={{ width: 360, marginBottom: 20 }}
          >
            {staple_array.map(item => (
              <Option key={item.staple_id} value={item.staple_id}>
                {item.staple_name}
              </Option>
            ))}
          </Select>
          <Row gutter={16}>
            <Col span={8}>
              <Card style={{ height: 360 }}>
                {store_class.map(_ => (
                  <p
                    className={this.getClsName(_.id, 'leverOne')}
                    key={_.id}
                    onClick={() => this.changeClassItem(_.id, 'leverOne')}
                  >
                    {_.name}
                  </p>
                ))}
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ height: 360 }}>
                {leverOne
                  ? leverOne.child.map(_ => (
                      <p
                        className={this.getClsName(_.id, 'leverTwo')}
                        key={_.id}
                        onClick={() => this.changeClassItem(_.id, 'leverTwo')}
                      >
                        {_.name}
                      </p>
                    ))
                  : null}
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ height: 360 }}>
                {leverTwo
                  ? leverTwo.child.map(_ => (
                      <p
                        className={this.getClsName(_.id, 'leverThree')}
                        key={_.id}
                        onClick={() => this.changeClassItem(_.id, 'leverThree')}
                      >
                        {_.name}
                      </p>
                    ))
                  : null}
              </Card>
            </Col>
          </Row>
        </Card>
        <Button
          block
          type="primary"
          style={{ marginTop: 10 }}
          onClick={() => this.nextStep()}
          disabled={this.disabled}
        >
          下一步，填写商品信息
        </Button>
      </div>
    );
  }
}
export default ChooseTag;
