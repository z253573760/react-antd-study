import React, { Component, Fragment } from 'react';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { Card, Button, Steps, Select, notification } from 'antd';
import styles from './edit.less';
import { getGoodsDetail, addGoods, editGoods } from '@/services/goods';

//组件相关
import UploadImg from '@/components/UploadImg';
import GoodsClass from './GoodsClass';
import Essential from './Essential';
import ChooseTag from './ChooseTag';
import Other from './Other';
import { debounce, arrayToJson, paraseGoodsClsName } from '@/utils/tools';

const Step = Steps.Step;
@withRouter
class AddGoods extends Component {
  state = {
    formInfo: { goods_name: '', goods_jingle: '', g_price: '', g_storage: '', goods_commend: 1 },
  };
  async componentWillMount() {
    const { pathname } = this.props.location;
    if (pathname !== `/goods/edit`) return;
    await this.getGoodsDetail();
  }
  async getGoodsDetail() {
    const { query } = this.props.location;
    const { datas } = await getGoodsDetail(query.id);
    this.setState({
      formInfo: datas,
    });
  }
  changeEssentialInfo = debounce(data => {
    const { formInfo } = this.state;
    this.setState({
      formInfo: { ...formInfo, ...data },
    });
  });
  get cate() {
    const { goodsClsName } = this.props;
    const { leverOne, leverThree, leverTwo } = goodsClsName;
    if (!goodsClsName.leverOne)
      return { cate_id: this.state.formInfo.gc_id, cate_name: this.state.formInfo.gc_name };
    const cate_name = paraseGoodsClsName([leverOne, leverTwo, leverThree]).slice(1);
    const lastLever = leverThree || leverTwo;
    const cate_id = lastLever.id;
    return { cate_id, cate_name };
  }
  handleSubmit = async e => {
    e.preventDefault();
    const dataList = [this.Essential.submit(), this.Other.submit()];
    const isError = dataList.every(_ => _ !== false);
    if (!isError) {
      notification.error({
        message: '提交失败',
        description: '请检查表单信息',
      });
      return;
    }
    const imgList = this.UploadImg.submit();
    if (!imgList.length) {
      notification.error({
        message: '提交失败',
        description: '商品主图必须上传',
      });
      return;
    }
    const image_path = imgList.find(_ => _.checked === true).url;
    const img = arrayToJson(
      imgList.map(_ => ({
        img_name: _.url,
        is_main: !!_.checked,
      }))
    );
    const [essentialForm, otherForm] = dataList;
    essentialForm.g_jingle = essentialForm.goods_jingle;
    essentialForm.g_name = essentialForm.goods_name;
    essentialForm.g_price = essentialForm.goods_price;
    delete essentialForm.goods_jingle;
    delete essentialForm.goods_name;
    delete essentialForm.goods_price;
    const data = {
      //  commonid: this.state.formInfo.goods_commonid,
      type_id: 0,
      ...this.cate,
      ...essentialForm,
      ...otherForm,
      sgcate_id: JSON.stringify({ 0: otherForm.sgcate_id }),
      ...this.GoodsClass.submit(),
      image_path,
      img: JSON.stringify(img),
    };
    if (this.state.formInfo.goods_commonid) {
      data.commonid = this.state.formInfo.goods_commonid;
      console.log('data', data);
      let spec = JSON.parse(data.spec);
      spec = spec.map(_ => ({ ..._, goods_id: data.commonid }));
      data.spec = JSON.stringify(spec);
    }
    const api = {
      '/goods/add': addGoods,
      '/goods/edit': editGoods,
    };

    const { code } = await api[this.props.location.pathname]({ ...data });
    if (code !== 200) {
      notification.error({
        message: '提交失败',
        description: '接口异常',
      });
      return;
    }
    this.props.nextStep(2);
  };
  get otherProps() {
    const { formInfo } = this.state;
    const { store_goods_class, goods_commend } = formInfo;
    const sgcate_id = store_goods_class ? store_goods_class[0].stc_id : '';

    return {
      //g_state: formInfo.g_state,
      sgcate_id,
      goods_commend,
    };
  }
  render() {
    const { state } = this;
    return (
      <Fragment>
        <Card title="商品基本信息">
          <Essential
            {...this.props}
            formInfo={state.formInfo}
            changeFormInfo={this.changeEssentialInfo}
            onRef={ref => (this.Essential = ref)}
          />
        </Card>
        <Card title="商品属性规格">
          <GoodsClass
            formInfo={state.formInfo}
            onRef={ref => (this.GoodsClass = ref)}
            {...this.props}
          />
        </Card>
        <Card title="商品图片">
          <UploadImg
            imgList={state.formInfo.img}
            nums={6}
            ref="upload"
            onRef={ref => (this.UploadImg = ref)}
          />
        </Card>
        <Card title="其他信息">
          <Other onRef={ref => (this.Other = ref)} {...this.otherProps} />
        </Card>
        <Button block type="primary" style={{ marginTop: 10 }} onClick={this.handleSubmit}>
          发布商品
        </Button>
      </Fragment>
    );
  }
}

class Ok extends Component {
  render() {
    return (
      <Card className={styles['ok-card']}>
        <p>
          <img style={{ width: 100 }} src={require('@/assets/image/成功.png')} />
        </p>
        <p>恭喜您，商品发布成功！等待管理员审核商品！</p>
        <p style={{ marginTop: 50 }}>
          <Button type="primary" style={{ marginRight: 50 }} onClick={() => this.props.nextStep(0)}>
            继续发布新商品
          </Button>
          <Button type="primary" onClick={() => router.push('/goods/list/up')}>
            查看已上架商品
          </Button>
        </p>
      </Card>
    );
  }
}
@withRouter
class Edit extends Component {
  state = {
    current: 0,
    goodsClsName: [],
  };

  nextStep = step => {
    if (step === 0 || step) {
      this.setState({
        current: step,
      });
      return;
    }
    this.setState(prevState => ({ current: prevState.current + 1 }));
  };
  changeGoodsClsName = goodsClsName => {
    this.setState({
      goodsClsName,
    });
  };
  async componentWillMount() {
    const { pathname } = this.props.location;
    //判断当前的 步骤 编辑页的话 步骤2  添加页的话步骤1
    const currnetStep = pathname === `/goods/add` ? 0 : 1;
    this.setState({ current: currnetStep });
  }
  render() {
    const { current } = this.state;
    const dict = {
      0: ChooseTag,
      1: AddGoods,
      2: Ok,
    };
    const Node = dict[current];
    const NodeProps = {
      nextStep: step => this.nextStep(step),
      changeGoodsClsName: goodsClsName => this.setState({ goodsClsName }),
      goodsClsName: this.state.goodsClsName,
    };
    return (
      <div className={styles.warpper}>
        <Card style={{ marginTop: 20 }}>
          <Steps current={current}>
            <Step title="选择经营类目" />
            <Step title="填写商品信息" />
            <Step title="商品发布成功" />
          </Steps>
        </Card>
        <Node {...NodeProps} />
      </div>
    );
  }
}
export default Edit;
