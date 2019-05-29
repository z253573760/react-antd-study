import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button, Table, notification } from 'antd';
import { getList } from '@/api/article';
const defaultPageOpts = {
  status: undefined,
  current: 1,
  pageSize: 10,
  sort: '-create_time',
};

const useList = (asyncApi, initPageOpts = defaultPageOpts) => {
  const [list, setList] = useState([]);
  const [pageOpts, setPageOpts] = useState(initPageOpts);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  useEffect(
    () => {
      (async () => {
        setLoading(true);
        try {
          const {
            data: { rows, count },
          } = await asyncApi(pageOpts);
          setList(rows);
          setCount(count);
        } catch (err) {
          setErr(true);
        } finally {
          setLoading(false);
        }
      })();
    },
    [pageOpts]
  );
  return {
    list,
    count,
    loading,
    err,
    setPageOpts,
    pageOpts,
  };
};

const getTableProps = ({ list, pageOpts, setPageOpts, count }) => ({
  dataSource: list,
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: true,
    },
  ],
  onChange: (pagination, filters, sorter) => {
    if (!sorter.order) {
      setPageOpts(defaultPageOpts);
      return;
    }
    const { order, field } = sorter;
    const sort = `${order === 'ascend' ? '' : '-'}${field}`;
    setPageOpts({ ...pagination, sort });
  },
  pagination: {
    ...pageOpts,
    total: count,
    onChange: (current, pageSize) => setPageOpts({ ...pageOpts, current, pageSize }),
  },
});

export default () => {
  const { list, count, loading, err, setPageOpts, pageOpts } = useList(getList);
  const [checkList, setCheckList] = useState([]);
  const tablePorps = useMemo(() => getTableProps({ list, pageOpts, setPageOpts, count }), [
    pageOpts,
    count,
  ]);

  const rowSelection = useMemo(
    () => ({
      onChange: (_, selectedRows) => {
        setCheckList(selectedRows.map(_ => _.id));
      },
    }),
    []
  );

  const handlerClick = useCallback(
    () => {
      notification.success({ message: checkList });
    },
    [checkList]
  );

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Button onClick={handlerClick}>点击</Button>
        <Table rowSelection={rowSelection} loading={loading} {...tablePorps} />
      </Card>
    </div>
  );
};
