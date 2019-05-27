import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Tabs, Table, Icon } from 'antd';
import { getCookById, cancelCookReason } from '@/services/order';
import router from 'umi/router';
import styles from './detail.less';
import {
  OkOrderBtn,
  DetailBtn,
  ChangePriceBtn,
  ChangePeopleNum,
  PayOrderBtn,
  SetOrderParentBtn,
  CancelOrderBtn,
  CorrelationOrder,
} from '../List/btn';
import Steps from './Step';
import { ORDER_STATUS_CODE } from '@/utils/static';

const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

function useDetail(id) {
  const [detail, setDetail] = useState({
    add_time: '',
    extend_order_goods: [],
    order_amount: '',
    order_message: [],
    buy_name: '',
    buy_phone: '',
    order_state: 10,
    order_id: id,
  });
  const getOrder = async () => {
    const { datas } = await getCookById(id);
    setDetail(datas);
  };
  useEffect(() => {
    getOrder();
  }, []);
  return {
    detail,
    getOrder,
  };
}

const dict = {
  state_received: {
    step: { current: 0 },
    btn: props => {
      props = { ...props, size: 'large' };
      return (
        <React.Fragment>
          {props.is_parent_order ? <SetOrderParentBtn {...props} cb={props.getOrder} /> : null}
          <OkOrderBtn {...props} cb={props.getOrder} />
          <CancelOrderBtn {...props} cb={() => router.push('/order/list/cook')} />
        </React.Fragment>
      );
    },
  },
  state_cooking: {
    step: { current: 1 },
    btn: props => {
      props = { ...props, size: 'large' };
      return (
        <React.Fragment>
          {props.is_parent_order ? <SetOrderParentBtn {...props} cb={props.getOrder} /> : null}
          <PayOrderBtn {...props} cb={props.getOrder} />
          <ChangePriceBtn {...props} cb={props.getOrder} />
          <ChangePeopleNum {...props} cb={props.getOrder} />
        </React.Fragment>
      );
    },
  },
  state_success: {
    step: { current: 2 },
    btn: props => {
      props = { ...props, size: 'large' };
      return (
        <React.Fragment>
          <PayOrderBtn {...props} />
        </React.Fragment>
      );
    },
  },
  state_cancel: {
    step: { current: 1, list: ['提交订单', '取消订单'] },
    btn: props => null,
  },
};

const Header = props => {
  const { detail, getOrder } = props;
  const key = ORDER_STATUS_CODE[detail.order_state];
  const [cancelList, setCancelList] = useState([]);
  const getCancelOrderReasonList = async () => {
    const {
      datas: { cancel },
    } = await cancelCookReason();
    setCancelList(cancel);
  };
  useEffect(() => {
    getCancelOrderReasonList();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles['title-warpper']}>
        <div className={styles.title}>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          订单编号：<span className={styles.order}>{detail.order_sn}</span>
        </div>
        <div className={styles['btn-group']}>
          <ButtonGroup>{dict[key].btn({ ...detail, cancelList, getOrder }) || null}</ButtonGroup>
        </div>
      </div>
      <Row>
        <Col span={6} style={{ paddingLeft: 42 }}>
          <p>下单时间：{detail.add_time}</p>
        </Col>
        <Col span={6} style={{ paddingLeft: 42 }}>
          <p>
            是否加菜：
            {detail.is_parent_order ? (
              <Icon type="check" style={{ color: 'green' }} />
            ) : (
              <Icon type="close" style={{ color: 'red' }} />
            )}
          </p>
        </Col>
        <Col span={6} style={{ paddingLeft: 42 }}>
          <p>桌号：{detail.table_num}</p>
        </Col>
        <Col span={6} style={{ paddingLeft: 42 }}>
          <p>状态：{detail.order_state_ch}</p>
        </Col>
      </Row>
    </div>
  );
};
const GoodsTable = props => {
  const { extend_order_goods } = props;
  const columns = [
    {
      key: 'goods_image',
      dataIndex: 'goods_image',
      align: 'center',
      title: '商品Icon',
      render: src => <img style={{ width: 50, height: 50, borderRadius: 3 }} src={src} />,
    },
    {
      key: 'goods_name',
      dataIndex: 'goods_name',
      align: 'center',
      title: '商品名称',
    },
    {
      key: 'goods_price',
      dataIndex: 'goods_price',
      align: 'center',
      title: '商品价格',
    },
    {
      key: 'goods_num',
      dataIndex: 'goods_num',
      align: 'center',
      title: '商品数量',
    },
    {
      key: 'goods_all_price',
      dataIndex: 'goods_all_price',
      align: 'center',
      title: '商品总价',
      render: (_, record) => {
        const { goods_num, goods_price } = record;
        const price = goods_price * 1000 * goods_num;
        return <span>{price / 1000}</span>;
      },
    },
    {
      key: 'actions',
      align: 'center',
      dataIndex: 'actions',
      title: '',
      render: () => <Button>详情</Button>,
    },
  ];
  return (
    <Table
      rowKey={record => record.order_id}
      pagination={false}
      columns={columns}
      dataSource={extend_order_goods}
    />
  );
};
export default props => {
  const {
    query: { id },
  } = props.location;
  const { detail, getOrder } = useDetail(id);
  const key = ORDER_STATUS_CODE[detail.order_state];
  const stepsProps = {
    ...dict[key].step,
    time: [detail.add_time, detail.cooking_time || '', detail.finnshed_time],
  };
  return (
    <React.Fragment>
      <Header detail={detail} getOrder={getOrder} />
      <div style={{ padding: '0 30px', marginTop: -44 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="订单详情" key="1">
            <Card title="流程进度">
              <Steps {...stepsProps} />
            </Card>
            <Card title="订单信息" style={{ marginTop: 20 }}>
              <Card
                type="inner"
                title="订单商品"
                extra={
                  <span>
                    订单总价：
                    <span style={{ fontSize: 20, color: 'red', fontWeight: 'bold' }}>
                      {detail.order_amount}
                    </span>
                  </span>
                }
              >
                <GoodsTable extend_order_goods={detail.extend_order_goods} />
              </Card>
              <Card type="inner" title="订单备注" style={{ marginTop: 15 }}>
                {detail.order_message[0] || '暂无备注'}
              </Card>
            </Card>
          </TabPane>
          <TabPane tab="用户详情" key="2">
            <Card title="基本信息">
              <Row>
                <Col span={6}>用户昵称：{detail.buyer_name}</Col>
                <Col span={6}>用户手机：{detail.buyer_phone}</Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  );
};
