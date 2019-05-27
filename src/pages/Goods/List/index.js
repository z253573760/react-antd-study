import react from 'react';
import {
  Tag,
  message,
  Popover,
  Table,
  Card,
  Button,
  Modal,
  Popconfirm,
  Icon,
  Select,
  Input,
  Drawer,
} from 'antd';
import { getList, delGoods, goodsActions, getGoodsDetail } from '@/services/goods';
import router from 'umi/router';
import styles from './list.less';
import { exportExcel } from 'xlsx-oc';
import { dateFormate } from '@/utils/tools';
import {
  GOODS_API_LIST_TYPE_TXT,
  GOODS_API_LIST_TYPE_CODE,
  GOODS_CHECK_STATUS_CODE,
  GOODS_CHECK_STATUS_TXT,
  GOODS_API_TYPE_ACTIONS,
} from '@/utils/static';
//自定义组件
import Detail from './Detail';
import { DelBtn, EditBtn, UpBtn, ExCelBtn, DownBtn, LikeBtn, DislikeBtn } from './btn';
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;

class List extends react.Component {
  constructor(props) {
    super(props);
    const { route } = props;
    this.state = {
      goods_list: [], //商品列表
      selected_ids: [], //选中的商品ID
      store_goods_class: [], // 商品分类 下拉框
      pageOpts: {
        types: this.Types, //商品状态类型
        page: 1,
        limit: 10,
        page_total: 0,
        cid: 0, //商品分类
        cn: 1, //搜索分类
        w: '', //搜索关键字
      },
      loading: true,
      goods_commonid: 0,
      visibleDetail: false,
    };
  }
  // 获取商品状态类型
  get Types() {
    return this.props.route.meta.types;
  }
  async componentWillMount() {
    await this.getList();
    // this.renderDomNodeOfTable();
  }
  // 用于更改表格得DOM 结构 把没有 规格得行前得 扩展按钮隐藏掉
  renderDomNodeOfTable() {
    const { goods_list } = this.state;
    const arr = [];
    goods_list.forEach((item, index) => {
      if (!item.spec_value) arr.push(index);
    });
    const el_list = document.querySelectorAll('.ant-table-row-expand-icon');
    for (const item of arr) {
      el_list[item].style.display = 'none';
    }
  }
  // 获取商标列表
  async getList(pageOpts = this.state.pageOpts) {
    this.setState({
      loading: true,
    });
    const {
      datas: { goods_list, page_total, store_goods_class },
    } = await getList(pageOpts);
    this.setState(
      {
        goods_list: goods_list.map(_ => ({
          ..._,
          goods_image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550220980024&di=bbde90f2a2304b7af46a112e6792de69&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D4217379483%2C208217009%26fm%3D214%26gp%3D0.jpg',
        })),
        store_goods_class: [
          { stc_id: GOODS_API_LIST_TYPE_CODE.ALL, stc_name: '全部' },
          ...store_goods_class.filter(_ => _.stc_state),
        ],
        pageOpts: { ...pageOpts, page_total },
        loading: false,
        selected_ids: [],
      },
      this.renderDomNodeOfTable
    );
  }

  // 表格组件 props 参数
  get TableProps() {
    const { goods_list, pageOpts, loading } = this.state;
    const columns = [
      {
        title: '商品图片',
        dataIndex: 'goods_image',
        key: 'goods_image',
        render: (src, record) => (
          <img
            style={{ width: 50, cursor: 'pointer' }}
            src={src}
            onClick={() => this.showGoodsDetail(record)}
          />
        ),
      },
      {
        title: 'SPU',
        dataIndex: 'goods_commonid',
        key: 'goods_commonid',
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        render: (src, record) => (
          <span>
            {record.goods_commend ? (
              <img
                src={require('@/assets/image/推.png')}
                style={{ marginRight: 3, marginTop: -3 }}
              />
            ) : (
              ''
            )}
            {src}
          </span>
        ),
      },
      {
        title: '价格',
        dataIndex: 'goods_price',
        key: 'goods_price',
      },
      {
        title: '商品分类',
        align: 'center',
        dataIndex: 'goods_stcids',
        key: 'goods_stcids',
      },
      {
        title: '每日限量',
        align: 'center',
        dataIndex: 'goods_storage_today',
        key: 'goods_storage_today',
      },
      {
        title: '发布时间',
        align: 'center',
        dataIndex: 'goods_selltime',
        key: 'goods_selltime',
        render: val => (val === 0 ? '立即发布' : dateFormate(val * 1000)),
      },
    ];
    if (this.Types === GOODS_API_LIST_TYPE_CODE.DOWN) {
      columns.push({
        title: '下架类型',
        align: 'center',
        dataIndex: 'goods_verify',
        key: 'goods_verify',
        render: (_, record) => (
          <span>
            {record.goods_verify === 0 ? (
              <Tag color="#2db7f5">未通过</Tag>
            ) : record.goods_state === 0 ? (
              <Tag color="#2db7f5">商家下架</Tag>
            ) : (
              <Tag color="#f50">违规下架</Tag>
            )}
          </span>
        ),
      });
    }
    //判断待审核
    if (this.Types !== GOODS_API_LIST_TYPE_CODE.CHECK) {
      const dict = {
        [GOODS_API_LIST_TYPE_CODE.UP]: (_, record) => (
          <span>
            <DownBtn
              onClick={() => this.goodsActions(GOODS_API_TYPE_ACTIONS.DOWN, record.goods_commonid)}
            />
            {record.goods_commend ? (
              <DislikeBtn
                onClick={() =>
                  this.goodsActions(GOODS_API_TYPE_ACTIONS.NO_LIKE, record.goods_commonid)
                }
              />
            ) : (
              <LikeBtn
                onClick={() =>
                  this.goodsActions(GOODS_API_TYPE_ACTIONS.LIKE, record.goods_commonid)
                }
              />
            )}
          </span>
        ),
        [GOODS_API_LIST_TYPE_CODE.WAIT]: (_, record) => (
          <span>
            <EditBtn id={record.goods_commonid} />
            <DelBtn onClick={() => this.delGoods(record.goods_commonid)} />
            <UpBtn onClick={() => this.delGoods(record.goods_commonid)} />
          </span>
        ),
        [GOODS_API_LIST_TYPE_CODE.DOWN]: (_, record) => (
          <span>
            <EditBtn id={record.goods_commonid} />
            {record.goods_state === 0 ? (
              <UpBtn onClick={() => this.delGoods(record.goods_commonid)} />
            ) : null}
            <DelBtn onClick={() => this.delGoods(record.goods_commonid)} />
          </span>
        ),
      };
      columns.push({
        title: '操作',
        dataIndex: 'action',
        //   align: 'center',
        key: 'action',
        render: dict[pageOpts.types],
      });
    }
    //表格多选属性
    const rowSelection = {
      onChange: (_, selectedRows) => {
        this.setState({
          selected_ids: selectedRows.map(_ => _.goods_commonid),
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    //表格分页属性
    const pagination = {
      current: pageOpts.page,
      pageSize: pageOpts.limit,
      total: pageOpts.page_total * pageOpts.limit,
      hideOnSinglePage: true,
      showQuickJumper: true,
      onChange: (page, limit) => {
        this.setState(
          {
            pageOpts: { ...pageOpts, page, limit },
          },
          this.getList
        );
      },
    };
    //点击表格展开
    const expandedRowRender = record => (
      <p style={{ marginLeft: 60 }}>
        {record._step_value && (
          <div className={styles['table-expanded']}>
            {record._step_value.map((_, key) => (
              <div style={{}} key={key}>
                <p>商品规格：{_.title}</p>
                <p>每日限量：{_.today_stock}</p>
                <p>商品价格：{_.price}</p>
              </div>
            ))}
          </div>
        )}
      </p>
    );
    return {
      rowKey: record => record.goods_commonid,
      columns,
      dataSource: goods_list,
      rowSelection,
      pagination,
      loading,
      expandedRowRender,
      onExpand: async (expanded, record) => {
        if (!expanded) return;
        if (record._step_value) return;
        const { datas } = await getGoodsDetail(record.goods_commonid);
        const { goods_list } = this.state;
        this.setState({
          goods_list: goods_list.map(_ => {
            if (_.goods_commonid !== record.goods_commonid) return _;
            return {
              ..._,
              _step_value: JSON.parse(datas.spec_value),
              img_list: datas.img,
            };
          }),
        });
      },
    };
  }
  exportExcel = async () => {
    const {
      datas: { goods_list },
    } = await getList({
      types: 0,
      limit: 999999,
      page: 1,
    });

    const dataSource = goods_list.map(_ => ({
      ..._,
      goods_commend: _.goods_commend ? '是' : '否',
      goods_selltime: _.goods_selltime === 0 ? '立即发布' : dateFormate(_.goods_selltime * 1000),
      goods_state: GOODS_API_LIST_TYPE_TXT[_.goods_state],
    }));
    const headers = [
      { k: 'goods_commonid', v: '商品ID' },
      { k: 'goods_name', v: '商品名称' },
      { k: 'goods_price', v: '商品价格' },
      { k: 'goods_selltime', v: '商品上架时间' },
      { k: 'goods_commend', v: '是否推荐' },
      { k: 'goods_state', v: '商品状态' },
    ];
    exportExcel(headers, dataSource);
  };
  pushSelected = () => {
    const { selected_ids } = this.state;
    confirm({
      title: '确认上架这些商品?',
      content: `您一共选中了${selected_ids.length}件商品`,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      cancelText: '取消',
      okText: '确认',
    });
  };

  delSelected = () => {
    const { selected_ids } = this.state;
    confirm({
      title: '确认删除这些商品?',
      content: `您一共选中了${selected_ids.length}件商品`,
      onOk: async () => {
        await this.delGoods(selected_ids.join(','));
      },
      cancelText: '取消',
      okText: '确认',
    });
  };

  delGoods = async id => {
    const {
      datas: { res },
    } = await delGoods(id);
    if (res !== 1) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.getList();
  };
  // 右侧抽屉详情组件 props 属性
  get DetailProps() {
    const { visibleDetail, goods_commonid } = this.state;
    return {
      onClose: () => this.setState({ visibleDetail: false }),
      visible: visibleDetail,
      goods_commonid,
    };
  }
  // 显示右侧抽屉详情
  showGoodsDetail = record => {
    const { goods_commonid } = record;
    this.setState({
      goods_commonid,
      visibleDetail: true,
    });
  };
  // 表格头部 商品分类更改
  onChangeStoreGoodsClass = cid => {
    const { pageOpts } = this.state;
    this.getList({
      ...pageOpts,
      cid,
    });
  };
  // 获取表格头部按钮组
  get HeaderBtns() {
    const disabled = !this.state.selected_ids.length;
    const topUpBtnHeader = (
      <Button
        disabled={disabled}
        type="primary"
        className={styles.btn}
        onClick={() => this.selectedAction(GOODS_API_TYPE_ACTIONS.UP)}
      >
        上架
      </Button>
    );
    const delBtnHeader = (
      <Button
        disabled={disabled}
        type="danger"
        className={styles.btn}
        onClick={() => this.selectedAction(GOODS_API_TYPE_ACTIONS.DEL)}
      >
        删除
      </Button>
    );
    const DownBtnHeader = (
      <Button
        disabled={disabled}
        type="danger"
        className={styles.btn}
        onClick={() => this.selectedAction(GOODS_API_TYPE_ACTIONS.DOWN)}
      >
        下架
      </Button>
    );

    const dict = {
      [GOODS_API_LIST_TYPE_CODE.UP]: () => <span>{DownBtnHeader}</span>,
      [GOODS_API_LIST_TYPE_CODE.WAIT]: () => (
        <span>
          {delBtnHeader}
          {topUpBtnHeader}
        </span>
      ),
      [GOODS_API_LIST_TYPE_CODE.DOWN]: () => <span>{delBtnHeader}</span>,
      [GOODS_API_LIST_TYPE_CODE.CHECK]: () => null,
    };
    return dict[this.Types]();
  }
  //商品操作接口 上架 下架 推荐 取消推荐
  async goodsActions(type, goods_commonid) {
    //
    const {
      datas: { res },
    } = await goodsActions({
      type,
      goods_commonid,
    });
    if (res !== 1) {
      message.error('操作失败');
      return;
    }
    message.success('操作成功');
    this.getList();
  }
  // 头部按钮 批量操作
  selectedAction = type => {
    const { selected_ids } = this.state;
    const dict = {
      [GOODS_API_TYPE_ACTIONS.UP]: {
        title: '确认上架这些商品?',
        cb: async () => await this.goodsActions(GOODS_API_TYPE_ACTIONS.UP, selected_ids.join(',')),
      },
      [GOODS_API_TYPE_ACTIONS.DOWN]: {
        title: '确认下架这些商品?',
        cb: async () =>
          await this.goodsActions(GOODS_API_TYPE_ACTIONS.DOWN, selected_ids.join(',')),
      },
      [GOODS_API_TYPE_ACTIONS.LIKE]: {
        title: '确认推荐这些商品?',
        cb: async () =>
          await this.goodsActions(GOODS_API_TYPE_ACTIONS.LIKE, selected_ids.join(',')),
      },
      [GOODS_API_TYPE_ACTIONS.NO_LIKE]: {
        title: '确认取消推荐这些商品?',
        cb: async () =>
          await this.goodsActions(GOODS_API_TYPE_ACTIONS.NO_LIKE, selected_ids.join(',')),
      },
      [GOODS_API_TYPE_ACTIONS.DEL]: {
        title: '确认删除这些商品?',
        cb: async () => await this.delGoods(selected_ids.join(',')),
      },
    };
    confirm({
      title: dict[type].title,
      content: `您一共选中了${selected_ids.length}件商品`,
      onOk: dict[type].cb,
      cancelText: '取消',
      okText: '确认',
    });
  };
  render() {
    const { selected_ids, store_goods_class, pageOpts } = this.state;
    return (
      <Card style={{ margin: 24 }}>
        <div className={styles['table-header']}>
          <div>
            {this.HeaderBtns}
            <ExCelBtn onClick={() => this.exportExcel()} />
          </div>
          <div>
            商品分类 ：
            <Select
              style={{ width: 200 }}
              defaultValue="全部"
              onChange={value =>
                this.getList({
                  ...pageOpts,
                  cid: value,
                })
              }
            >
              {store_goods_class.map(_ => (
                <Option key={_.stc_id} value={_.stc_id}>
                  {_.stc_name}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: 100, marginLeft: 20, marginRight: 5 }}
              onChange={cn => this.setState({ pageOpts: { ...pageOpts, cn } })}
              defaultValue={1}
            >
              <Option value={1}>商品名称</Option>
              <Option value={2}>SPU</Option>
            </Select>
            <Search
              style={{ display: 'inline-block', width: 300 }}
              placeholder="请输入你要查找的关键字"
              onSearch={value => this.getList({ ...pageOpts, w: value })}
              enterButton
            />
          </div>
        </div>
        <Table {...this.TableProps} />
        <Detail {...this.DetailProps} />
      </Card>
    );
  }
}
export default List;
