import React from 'react';
import Header from '@/components/HeaderTable';
import { getCookList, cancelCookReason } from '@/services/order';
import { Card, Table, Button } from 'antd';
import { ORDER_STATUS_CODE } from '@/utils/static';
import {
  OkOrderBtn,
  DetailBtn,
  ChangePriceBtn,
  ChangePeopleNum,
  PayOrderBtn,
  SetOrderParentBtn,
  CancelOrderBtn,
} from './btn';
// const STATUS = {
//   10: 'state_received',
//   30: 'state_cooking',
//   40: 'state_success',
//   0: 'state_cancel',
// };

class Cook extends React.Component {
  state = {
    pageOpts: {
      state_type: 'state_all',
      limit: 10,
      page: 1,
      page_total: 0,
      start_time: '',
      end_time: '',
    },
    list: [],
    loading: true,
    cancelList: [],
  };
  async componentDidMount() {
    this.getList();
    this.getCancelOrderReasonList();
  }
  getCancelOrderReasonList = async () => {
    const {
      datas: { cancel },
    } = await cancelCookReason();
    this.setState({
      cancelList: cancel,
    });
  };
  getList = async () => {
    this.setState({
      loading: true,
    });
    const {
      datas: { order_list, page_total },
    } = await getCookList(this.state.pageOpts);
    this.setState({
      list: order_list,
      loading: false,
      pageOpts: { ...this.state.pageOpts, page_total },
    });
  };
  changePageOpts = newPageOpts => {
    this.setState(
      {
        pageOpts: { ...this.state.pageOpts, ...newPageOpts },
      },
      this.getList
    );
  };
  get TableProps() {
    const list = [...this.state.list];
    const cancelList = [...this.state.cancelList];
    const pageOpts = { ...this.state.pageOpts };
    const dict = {
      state_received: {
        txt: '待接单',
        render: (_, record) => {
          return (
            <React.Fragment>
              <DetailBtn {...record} />
              {record.is_parent_order ? <SetOrderParentBtn {...record} cb={this.getList} /> : null}
              <OkOrderBtn {...record} cb={this.getList} />
              <CancelOrderBtn {...record} cb={this.getList} cancelList={cancelList} />
            </React.Fragment>
          );
        },
      },
      state_cooking: {
        txt: '已下厨',
        render: (_, record) => {
          return (
            <React.Fragment>
              <DetailBtn {...record} />
              {record.is_parent_order ? <SetOrderParentBtn {...record} cb={this.getList} /> : null}
              <PayOrderBtn {...record} cb={this.getList} />
              <ChangePriceBtn {...record} />
              <ChangePeopleNum {...record} />
            </React.Fragment>
          );
        },
      },
      state_success: {
        txt: '已完成',
        render: (_, record) => {
          return (
            <React.Fragment>
              <DetailBtn {...record} />
              <PayOrderBtn {...record} cb={this.getList} />
            </React.Fragment>
          );
        },
      },
      state_cancel: {
        txt: '已取消',
        render: (_, record) => {
          return (
            <React.Fragment>
              <DetailBtn {...record} />
            </React.Fragment>
          );
        },
      },
    };
    const columns = [
      {
        key: 'goods_image',
        dataIndex: 'goods_image',
        title: '商品Icon',
        render: (src, record) => {
          const { extend_order_goods } = record;
          const [{ goods_image }] = extend_order_goods;
          return (
            <div style={{ position: 'relative' }}>
              <img style={{ width: 70, height: 70 }} src={goods_image} />
              {record.is_parent_order ? (
                <img
                  style={{ width: 50, height: 35, position: 'absolute', left: -10, top: -10 }}
                  src={require('@/assets/image/jiacai.png')}
                />
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'goods_name_ch',
        dataIndex: 'goods_name_ch',
        title: '商品名称',
      },
      {
        key: 'order_sn',
        dataIndex: 'order_sn',
        title: '订单编号',
      },
      {
        key: 'table_num',
        dataIndex: 'table_num',
        align: 'center',
        title: '桌号',
      },
      {
        key: 'buyer_name',
        dataIndex: 'buyer_name',
        title: '买家名字',
      },
      {
        key: 'goods_amount',
        align: 'center',
        dataIndex: 'goods_amount',
        title: '订单金额',
      },
      {
        key: 'order_state',
        align: 'center',
        dataIndex: 'order_state',
        title: '订单状态',
        render: (_, record) => {
          const key = ORDER_STATUS_CODE[record.order_state];
          return dict[key].txt || null;
        },
      },
      {
        key: 'add_time',
        dataIndex: 'add_time',
        title: '下单时间',
        align: 'center',
      },
      {
        key: 'actions',
        dataIndex: 'actions',
        align: 'center',
        title: '',
        render: (_, record) => {
          const key = ORDER_STATUS_CODE[record.order_state];
          return dict[key].render(_, record) || null;
        },
      },
    ];
    const pagination = {
      showQuickJumper: true,
      current: pageOpts.page,
      pageSize: pageOpts.limit,
      total: pageOpts.page_total * pageOpts.limit,
      hideOnSinglePage: true,
      onChange: (page, limit) => this.changePageOpts({ page, limit }),
    };
    return {
      rowKey: record => record.order_sn,
      columns,
      dataSource: list,
      pagination,
      loading: this.state.loading,
    };
  }
  get HeaderProps() {
    const { pageOpts } = this.state;
    const list = [
      { value: 'state_all', txt: '全部 ' },
      { value: 'state_received', txt: '待接单' },
      { value: 'state_cooking', txt: '已下厨' },
      { value: 'state_success', txt: '已完成' },
      { value: 'state_cancel', txt: '已取消' },
    ];
    return {
      list,
      pageOpts,
      onChange: this.changePageOpts,
    };
  }
  render() {
    return (
      <Card style={{ margin: 20 }}>
        <Header {...this.HeaderProps} />
        <Table {...this.TableProps} />
      </Card>
    );
  }
}
export default Cook;
