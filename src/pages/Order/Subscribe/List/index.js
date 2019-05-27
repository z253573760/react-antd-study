import React, { useState, useEffect } from 'react';

import { Card, Table, Button } from 'antd';
import Header from '@/components/HeaderTable';

import { getSubscribeList, getCancelSubscribeReason } from '@/services/order';
import { SUBSCRIBE_STATUS_CODE as CODE } from '@/utils/static';
import { DetailBtn, OkOrderBtn, CancelOrderBtn } from '../btn';

function useCancelSubscribeReason() {
  const [cancelSubscribeReason, setCancelSubscribeReason] = useState([]);
  const init = async () => {
    const {
      datas: { canwei },
    } = await getCancelSubscribeReason();
    setCancelSubscribeReason(canwei);
  };
  useEffect(() => {
    init();
  }, []);
  return { cancelSubscribeReason };
}

function useSubscribeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageOpts, setPageOpts] = useState({
    limit: 10,
    page: 1,
    page_total: 0,
    sn: '',
    buy_name: '',
    state_type: 0,
    start_time: '',
    end_time: '',
  });
  const getList = async (newPageOpts = {}) => {
    setLoading(true);
    const {
      datas: { reserve_list, page_total },
    } = await getSubscribeList({
      ...pageOpts,
      ...newPageOpts,
    });
    setList(reserve_list);
    setPageOpts({ ...pageOpts, ...newPageOpts, page_total });
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return {
    getList,
    pageOpts,
    list,
    loading,
  };
}

function useListHook(
  promiseCb,
  defaultPageOpts = {
    limit: 10,
    page: 1,
    page_total: 0,
    sn: '',
    buy_name: '',
    state_type: 0,
    start_time: '',
    end_time: '',
  }
) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageOpts, setPageOpts] = useState(defaultPageOpts);
  const getList = async (newPageOpts = {}) => {
    setLoading(true);
    const {
      datas: { reserve_list, page_total },
    } = await promiseCb({
      ...pageOpts,
      ...newPageOpts,
    });
    setList(reserve_list);
    setPageOpts({ ...pageOpts, ...newPageOpts, page_total });
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return {
    getList,
    pageOpts,
    list,
    loading,
  };
}

export default () => {
  const { getList, pageOpts, list, loading } = useSubscribeList();
  const { cancelSubscribeReason } = useCancelSubscribeReason();
  const HeaderProps = {
    pageOpts,
    onChange: pageOpts => getList(pageOpts),
    list: [
      { value: 0, txt: '全部' },
      { value: 'state_wait', txt: '待确认' },
      { value: 'state_store_wait', txt: '待到店' },
      { value: 'state_store_over', txt: '已到店' },
      { value: 'state_success', txt: '已完成' },
      { value: 'state_cancel', txt: '已取消' },
    ],
  };
  const dict = {
    [CODE.STATE_WAIT]: record => {
      return (
        <React.Fragment>
          <DetailBtn {...record} />
          <OkOrderBtn {...record} cb={getList} />
        </React.Fragment>
      );
    },
    [CODE.STATE_STORE_WAIT]: record => {
      console.log(record);
      return (
        <React.Fragment>
          <CancelOrderBtn {...record} cancelList={cancelSubscribeReason} />
          <DetailBtn {...record} />
        </React.Fragment>
      );
    },
    [CODE.STATE_STORE_OVER]: record => {
      return <DetailBtn {...record} />;
    },
    [CODE.STATE_SUCCESS]: record => {
      return <DetailBtn {...record} />;
    },
    [CODE.STATE_CANCEL]: record => {
      return <DetailBtn {...record} />;
    },
  };
  const columns = [
    {
      key: 'store_image',
      align: 'center',
      dataIndex: 'store_image',
      title: '店铺图片',
      render: src => <img src={src} />,
    },
    {
      key: 'goods_name_ch',
      align: 'center',
      dataIndex: 'goods_name_ch',
      title: '商品名称',
    },
    {
      key: 'reserve_sn',
      align: 'center',
      dataIndex: 'reserve_sn',
      title: '预约单编号',
    },
    {
      key: 'yuyue_text',
      align: 'center',
      dataIndex: 'yuyue_text',
      title: '预约人数时间',
    },
    {
      key: 'add_time',
      align: 'center',
      dataIndex: 'add_time',
      title: '下单时间',
    },
    {
      key: 'reserve_state_ch',
      align: 'center',
      dataIndex: 'reserve_state_ch',
      title: '状态',
    },
    {
      key: 'actions',
      align: 'center',
      dataIndex: 'actions',
      title: '',
      render: (_, record) => dict[record.reserve_state](record),
    },
  ];
  const TableProps = {
    rowKey: ({ reserve_id }) => reserve_id,
    loading,
    dataSource: list,
    columns,
    hideOnSinglePage: true,
    pagination: {
      showQuickJumper: true,
      current: pageOpts.page,
      pageSize: pageOpts.limit,
      total: pageOpts.page_total * pageOpts.limit,
      hideOnSinglePage: true,
      onChange: (page, limit) => getList({ page, limit }),
    },
  };
  return (
    <Card style={{ margin: 20 }}>
      <Header {...HeaderProps} />
      <Table {...TableProps} />
    </Card>
  );
};
