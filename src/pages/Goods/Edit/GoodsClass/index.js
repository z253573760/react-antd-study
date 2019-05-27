import React, { Component, Fragment } from 'react';
// import withRouter from 'umi/withRouter';
import { Form, Button, Input, Card, notification, Tag, Icon, Checkbox } from 'antd';
import styles from './goods.less';
import './index.css';
import GoodsModalName from './GoodsModalName';
import GoodsModalTag from './GoodsModalTag';
import Group from '@/utils/group';
import GoodParams from './GoodsParams';
import { debounce, arrayToJson } from '@/utils/tools';
import { getGoodsSpecifi, addSpecifiName, delSpecifiName } from '@/services/goods';
// import { CSSTransitionGroup, CSSTransition } from 'react-transition-group';
class Goods extends Component {
  state = {
    isTagModal: false,
    tagModalInfo: {
      isShow: false,
      name: '',
      tagList: [],
      listIndex: -1,
      tagIndex: -1,
    },
    name: {
      value: '',
    },
    visibleAddBtn: true,
    _list: [
      //list数据格式 这个属性没有使用
      {
        name: '属性名',
        val: '',
        boxList: [{ value: 'Apple', checked: true }, { value: 'Pear', checked: true }],
        isInput: false,
        isModal: false,
      },
      {
        name: '属性名字',
        val: '',
        boxList: [{ value: 'Orange', checked: true }, { value: 'Grape', checked: true }],
        isInput: false,
      },
    ],
    list: [],
    goodParamsList: [],
    isGetHttp: true,
    gc_id: '',
  };
  changeShowModalTag = (listIndex, tagIndex) => {
    const { tagModalInfo, list } = this.state;
    const { isShow } = tagModalInfo;
    if (isShow) {
      this.setState({
        tagModalInfo: {
          name: '',
          tagList: [],
          listIndex: -1,
          tagIndex: -1,
          isShow: !isShow,
        },
      });
      return;
    }
    const tagList = list[listIndex].boxList;
    const name = tagList[tagIndex].value;
    this.setState({
      tagModalInfo: {
        name,
        tagList,
        listIndex,
        tagIndex,
        isShow: !isShow,
      },
    });
  };
  changeTagList = (newName, tagIndex, listIndex) => {
    const list = [...this.state.list];
    this.changeShowModalTag();
    const oldName = list[listIndex].boxList[tagIndex].value;
    if (oldName === newName) return;
    const goodParamsList = [...this.state.goodParamsList];
    for (const item of goodParamsList) {
      const data = item.val.split(',');
      if (data[listIndex] === oldName) {
        data[listIndex] = newName;
      }
      item.val = data.join(',');
    }
    list[listIndex].boxList[tagIndex].value = newName;
    this.setState({ list, goodParamsList });
  };

  changeGoodsListName = (newName, index) => {
    const list = [...this.state.list];
    list[index].name = newName;
    list[index].isModal = false;
    this.setState({ list });
  };

  addList = async () => {
    // const { formInfo, goodsClsName } = this.props;
    const { list, name, visibleAddBtn, gc_id } = this.state;
    const newName = name.value.trim();
    const result = list.find(_ => _.name === newName);
    const reg = /^[\u4e00-\u9fa5]+$/;
    if (!reg.test(newName) || newName.length > 4) {
      this.setState({
        name: {
          value: newName,
          validateStatus: 'error',
          error: '请输入正确的商品属性名称，不超过4个汉字',
        },
      });
      notification.error({
        message: '填写错误',
        description: '请输入正确的商品属性名称，不超过4个汉字',
      });
      return;
    }
    if (result) {
      this.setState({
        name: { value: newName, validateStatus: 'error', error: '商品属性名称不能重复' },
      });
      notification.error({
        message: '填写错误',
        description: '商品属性名称不能重复',
      });
      return;
    }
    const {
      datas: { spi_id },
    } = await addSpecifiName({ name: newName, gc_id });
    this.setState({
      list: [...list, { name: newName, spi_id, boxList: [] }],
      name: '',
      visibleAddBtn: !visibleAddBtn,
    });
  };

  delList = async index => {
    const { list } = this.state;
    const result = list[index];
    if (result.boxList.length) {
      notification.error({
        message: '删除失败',
        description: '请先删除该属性下的规格值',
      });
      return;
    }
    //delSpecifiName
    const {
      datas: { res },
      code,
    } = await delSpecifiName({ spi_id: result.spi_id });
    if (code !== 200) {
      notification.error({
        message: '删除失败',
        description: '请求接错错误',
      });
      return;
    }
    if (res !== 1) {
      notification.error({
        message: '删除失败',
        description: '请求接错错误',
      });
      return;
    }
    notification.success({
      message: '删除成功',
    });
    list.splice(index, 1);
    this.setState({ list }, this.setGoodParams());
  };

  changeName = (e, index = null) => {
    const value = e.target.value;
    this.setState({
      name: {
        value,
      },
    });
  };

  changeBoxVal = (e, index) => {
    const { list } = this.state;
    const item = { ...list[index] };
    item.val = e.target.value;
    list[index] = item;
    this.setState({ list });
  };

  addTag = async index => {
    const { list, gc_id } = this.state;
    let newTagVal = list[index].val;
    if (!newTagVal) {
      list[index].isInput = false;
      this.setState({ list });
      return;
    }
    newTagVal = newTagVal.trim();
    if (list[index].boxList.find(_ => _.value === newTagVal)) {
      notification.error({ message: '填写错误', description: '该规格值已存在' });
      return;
    }
    const {
      datas: { spi_val_id },
      code,
    } = await addSpecifiName({
      name: newTagVal,
      gc_id,
      spi_id: list[index].spi_id,
    });
    if (code !== 200) {
      notification.error({ message: '添加失败', description: '请求接口错误' });
      return;
    }
    list[index].boxList.push({ value: list[index].val, spi_val_id });
    list[index].val = '';
    list[index].isInput = !list[index].isInput;
    this.setState({ list });
  };

  delTag = async (e, index, box_index) => {
    e.preventDefault();
    e.stopPropagation();
    const { list } = this.state;
    const item = list[index].boxList[box_index];
    if (item.checked) {
      notification.error({ message: '删除失败', description: '无法删除已经选中的规格值' });
      return;
    }
    const {
      datas: { res },
      code,
    } = await delSpecifiName({
      spi_val_id: item.spi_val_id,
    });
    if (code !== 200) {
      notification.error({ message: '删除失败', description: '请求接口错误' });
      return;
    }
    if (res !== 1) {
      notification.error({ message: '删除失败', description: '请求接口错误' });
      return;
    }
    list[index].boxList.splice(box_index, 1);
    this.setState({ list });
  };

  chooseTag = (index, box_index) => {
    const { list } = this.state;
    list[index].boxList[box_index].checked = !list[index].boxList[box_index].checked;
    this.setState({ list }, this.setGoodParams());
  };

  get goodParamsProps() {
    const { goodParamsList } = this.state;
    return { list: goodParamsList, changeVal: this.changeVal };
  }

  setGoodParams = (newList = this.state.list, specValue = []) => {
    const { goodParamsList } = this.state;
    const defaultArr = Group.result(newList, goodParamsList, this.props.formInfo.goods_price);
    const newArr = defaultArr.map(_ => {
      const item = specValue.find(item => item.title === _.val);
      return {
        ..._,
        price: item ? item.price : _.price,
        nums: item ? item.stock : _.nums,
      };
    });
    this.setState({ goodParamsList: newArr });
  };

  changeVal = (value, type, index) => {
    const { goodParamsList } = this.state;
    goodParamsList[index][type] = value;
    this.setState({ goodParamsList });
  };
  submit = () => {
    const goodParamsList = [...this.state.goodParamsList];
    const list = [...this.state.list];
    const sp_name = {};
    const sp_val = {};
    const checkedList = [];
    for (const item of list) {
      const { spi_id, boxList } = item;
      const isChecked = boxList.find(_ => _.checked === true);
      if (!isChecked) continue;
      checkedList.push(item);
      sp_name[spi_id] = item.name;
      sp_val[spi_id] = {};
      for (const _item of boxList) {
        if (_item.checked) {
          sp_val[spi_id][_item.spi_val_id] = _item.value;
        }
      }
    }

    // const spec = [];
    const spec = goodParamsList.map(_ => {
      const { val } = _;
      const obj = { sp_value: {}, price: _.price || 0, stock: _.nums, stock_today: '' };
      const valArr = val.split(',');
      for (let i = 0; i < valArr.length; i++) {
        const result = checkedList[i].boxList.find(_ => _.value === valArr[i]);
        obj.sp_value[`${result.spi_val_id}`] = result.value;
      }
      return obj;
    });

    return {
      sp_val: JSON.stringify(sp_val),
      sp_name: JSON.stringify(sp_name),
      spec: spec.length ? JSON.stringify(spec) : '',
    };
  };

  showInput = (index, type = 'input') => {
    const { list } = this.state;
    if (type === 'input') {
      list[index].isInput = !list[index].isInput;
      this.setState({ list }, () => this.input.focus());
      return;
    }
    if (type === 'modal') {
      list[index].isModal = !list[index].isModal;
      this.setState({ list });
      return;
    }
  };

  saveInputRef = input => {
    this.input = input;
  };
  // 上层传来的PROPS 判断第一次 为初始化
  // 初始化的时候请求商品规格接口
  // 经营类目发生改变的时候请求接口
  async componentWillReceiveProps(nextProps) {
    const { formInfo, goodsClsName } = nextProps;
    let gc_id = undefined;
    if (goodsClsName.length === 0) {
      gc_id = formInfo.gc_id;
    } else {
      const { leverThree, leverTwo } = goodsClsName;
      const lever = leverThree || leverTwo;
      gc_id = lever.id;
    }
    if (gc_id !== this.state.gc_id) {
      await this.getSpecList(formInfo, gc_id);
    }
    this.setState({ gc_id });
  }
  async componentWillMount() {
    const { goodsClsName } = this.props;
    if (goodsClsName.length !== 0) {
      const { leverThree, leverTwo } = goodsClsName;
      const lever = leverThree || leverTwo;
      const gc_id = lever.id;
      await this.getSpecList({ spec_checked: [], spec_value: '' }, gc_id);
      this.setState({ gc_id });
    }
    this.props.onRef(this);
  }
  async getSpecList({ spec_value, spec_checked }, gc_id) {
    //获取商品属性列表
    const { datas: spec_list } = await getGoodsSpecifi(gc_id);
    const specValue = spec_value ? JSON.parse(spec_value) : [];

    const specList = spec_list.map(_ => {
      const boxList = _.val_name.map(val_name_item => {
        const new_val_name_item = {
          value: val_name_item.spi_val_name,
          checked: !!spec_checked.find(_ => _.id === val_name_item.spi_val_id),
        };
        return { ...val_name_item, ...new_val_name_item };
      });
      const obj = {
        name: _.spi_name,
        val: '',
        isInput: false,
        isModal: false,
        boxList,
      };
      return { ..._, ...obj };
    });
    this.setState({ list: specList }, this.setGoodParams(specList, specValue));
  }
  render() {
    const {
      result,
      state: { list, name, goodParamsList, visibleAddBtn },
    } = this;
    return (
      <Form>
        <div>
          {list.map((item, index) => {
            return (
              <div key={index} className={styles['line-warpper']}>
                <Card className={styles.card}>
                  <div className={styles.line}>
                    <div className={styles.name}>
                      <span style={{ width: 60, display: 'inline-block' }}> {item.name}</span>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.showInput(index, 'modal')}
                        icon="edit"
                      >
                        编辑
                      </Button>
                    </div>
                    <div className={styles.content}>
                      {item.boxList.map((box_item, box_index) => (
                        // <Tag
                        //   style={{ marginBottom: 5 }}
                        //   key={box_index}
                        //   onClose={e => this.delTag(e, index, box_index)}
                        //   closable
                        //   color={box_item.checked ? '#f50' : '#708090'}
                        //   onClick={() => this.chooseTag(index, box_index)}
                        // >
                        //   {box_item.value}
                        // </Tag>
                        <div className={styles.tag} key={box_index}>
                          <Checkbox
                            checked={box_item.checked}
                            onChange={() => this.chooseTag(index, box_index)}
                            style={{ marginRight: 5 }}
                          />
                          {box_item.value}
                          <Button
                            style={{ marginLeft: 5 }}
                            type="primary"
                            size="small"
                            // icon="edit"
                            // shape='circle'
                            onClick={() => this.changeShowModalTag(index, box_index)}
                          >
                            编辑
                          </Button>
                          <Button
                            style={{ marginLeft: 5 }}
                            onClick={e => this.delTag(e, index, box_index)}
                            type="danger"
                            size="small"
                            // icon="close"
                            // shape='circle'
                          >
                            删除
                          </Button>
                        </div>
                      ))}
                      {item.isInput ? (
                        <Input
                          ref={this.saveInputRef}
                          style={{ width: 100, marginLeft: 5, height: 40, marginTop: 1 }}
                          value={item.val}
                          onBlur={() => this.addTag(index)}
                          onPressEnter={() => this.addTag(index)}
                          onChange={e => this.changeBoxVal(e, index)}
                        />
                      ) : null}
                      {!item.isInput && item.boxList.length < 6 ? (
                        <div
                          className={styles.tag}
                          onClick={() => this.showInput(index)}
                          style={{
                            border: 'dashed 1px #d9d9d9',
                            cursor: 'pointer',
                            background: 'white',
                          }}
                        >
                          <Icon type="plus" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Card>
                <Button
                  icon="close"
                  shape="circle"
                  size="small"
                  type="danger"
                  onClick={() => this.delList(index)}
                  style={{ position: 'absolute', top: -12, right: -12 }}
                />
                <GoodsModalName
                  onCancel={() => this.showInput(index, 'modal')}
                  list={list}
                  item={item}
                  index={index}
                  onOk={this.changeGoodsListName}
                />
              </div>
            );
          })}

          {visibleAddBtn && list.length < 5 ? (
            <Button
              type="dashed"
              block
              className={styles.addParamsBtn}
              onClick={() => this.setState({ visibleAddBtn: !visibleAddBtn })}
            >
              <div>
                <p style={{ marginTop: 10 }}>
                  <Icon type="plus" /> 添加属性
                </p>
                <p style={{ marginTop: 10 }}> (每个商品最多可以添加5个属性)</p>
              </div>
            </Button>
          ) : null}
          {!visibleAddBtn ? (
            <Card style={{ marginBottom: 20 }}>
              <Form.Item
                label="商品属性名称"
                validateStatus={name.validateStatus}
                help={name.error}
              >
                <Input
                  style={{ width: 400 }}
                  placeholder="请填写商品名称 , 不超过4个汉字"
                  onChange={e => debounce(this.changeName(e))}
                />
                <Button type="primary" onClick={this.addList} style={{ marginLeft: 10 }}>
                  添加
                </Button>
                <Button
                  type="danger"
                  style={{ marginLeft: 10 }}
                  onClick={() => this.setState({ visibleAddBtn: !visibleAddBtn })}
                >
                  取消
                </Button>
              </Form.Item>
            </Card>
          ) : null}
        </div>
        {goodParamsList.length ? <GoodParams {...this.goodParamsProps} /> : null}
        <GoodsModalTag
          changeShowModalTag={this.changeShowModalTag}
          changeTagList={this.changeTagList}
          {...this.state.tagModalInfo}
        />
      </Form>
    );
  }
}

export default Goods;
