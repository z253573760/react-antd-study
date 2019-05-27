import react from 'react';
import { Drawer, Icon } from 'antd';
import { getGoodsDetail } from '@/services/goods';
class Detail extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
    };
  }
  async componentWillReceiveProps({ visible, goods_commonid }) {
    if (!visible) return;
    const { datas } = await getGoodsDetail(goods_commonid);
    // const { spec_value } = datas;
    // const result = JSON.parse(spec_value);
    this.setState({
      detail: datas,
    });
  }
  render() {
    const { onClose, visible, goods_commonid } = this.props;
    const { detail } = this.state;
    return (
      <Drawer
        title="商品详情"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
      >
        <p>
          <img
            style={{ width: 150, margin: 'auto' }}
            src={
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550220980024&di=bbde90f2a2304b7af46a112e6792de69&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D4217379483%2C208217009%26fm%3D214%26gp%3D0.jpg'
            }
          />
        </p>
        <p>商品名称 : {detail.goods_name}</p>
        <p>分类名称 : {detail.gc_name}</p>
        <p>商品价格 : {detail.goods_price}</p>
        <p>销售限量 : {detail.g_storage}</p>
        <p>
          是否推荐 :
          {detail.goods_commend ? (
            <Icon style={{ color: 'green' }} type="check" />
          ) : (
            <Icon style={{ color: 'red' }} type="close" />
          )}
        </p>
        <p>商品简介 : {detail.goods_jingle || '暂无填写'}</p>
      </Drawer>
    );
  }
}
export default Detail;
