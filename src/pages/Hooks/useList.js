import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, Button, Table, notification } from 'antd';
import { getList } from '@/api/article';
const defaultPageOpts = {
  status: undefined,
  current: 1,
  pageSize: 10,
  sort: undefined,
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

const useTableProps = ({ pageOpts, setPageOpts, count }) => {
  const columns = useRef([
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: true,
    },
  ]);
  // const opts = useMemo(
  //   () => ({
  //     pagination: {
  //       ...pageOpts,
  //       total: count,
  //       showQuickJumper: true,
  //       showSizeChanger: true,
  //     },
  //     onChange: (pagination, filters, sorter) => {
  //       const sort = sorter.order
  //         ? `${sorter.order === 'descend' ? '-' : ''}${sorter.columnKey}`
  //         : undefined;
  //       const pageOpts = { ...pagination, sort };
  //       setPageOpts(pageOpts);
  //     },
  //   }),
  //   [pageOpts, count]
  // );
  const pagination = useMemo(() => ({
    ...pageOpts,
    total: count,
    showQuickJumper: true,
    showSizeChanger: true,
  }));
  const onChange = useCallback((pagination, filters, sorter) => {
    const sort = sorter.order
      ? `${sorter.order === 'descend' ? '-' : ''}${sorter.columnKey}`
      : undefined;
    const pageOpts = { ...pagination, sort };
    setPageOpts(pageOpts);
  }, []);
  return {
    columns: columns.current,
    pagination,
    onChange,
  };
};
const useRowSelection = cb => {
  const [checkList, setCheckList] = useState([]);
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
      cb && cb(checkList);
    },
    [checkList]
  );
  return {
    handlerClick,
    rowSelection,
  };
};
export default () => {
  const { list, count, loading, err, setPageOpts, pageOpts } = useList(getList);
  const tablePorps = useTableProps({ pageOpts, setPageOpts, count });
  const { rowSelection, handlerClick } = useRowSelection(list => {
    notification.success({ message: list });
  });
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Button onClick={handlerClick}>点击</Button>
        <Table dataSource={list} rowSelection={rowSelection} loading={loading} {...tablePorps} />
      </Card>
    </div>
  );
};
