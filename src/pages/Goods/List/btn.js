import react from 'react';
import { Popconfirm, Button, Icon, ExcelBtn, Popover } from 'antd';
import router from 'umi/router';
import styles from './list.less';

//删除按钮 表格
export const DelBtn = props => (
  <Popconfirm
    title="确定删除该商品?"
    onConfirm={() => props.onClick(props.id)}
    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
  >
    <Button className={styles.btn} icon="delete" size="small" type="danger">
      {props.text || '删除'}
    </Button>
  </Popconfirm>
);

// 编辑按钮 表格
export const EditBtn = props => (
  <Button
    type="primary"
    onClick={() => router.push(`/goods/edit?id=${props.id}`)}
    className={styles.btn}
    icon="edit"
    size="small"
  >
    {props.text || '编辑'}
  </Button>
);

//上架按钮  表格
export const UpBtn = props => (
  <Button
    type="primary"
    className={styles.btn}
    icon="to-top"
    size={props.size || 'small'}
    onClick={props.onClick}
  >
    {props.text || '上架'}
  </Button>
);

// 下架按钮 表格
export const DownBtn = props => (
  <Button
    type="danger"
    className={styles.btn}
    icon="download"
    size={props.size || 'small'}
    onClick={props.onClick}
  >
    {props.text || '下架'}
  </Button>
);
// 推荐按钮
export const LikeBtn = props => (
  <Button className={styles.btn} icon="like" size={props.size || 'small'} onClick={props.onClick}>
    {props.text || '推荐'}
  </Button>
);
//取消推荐按钮 表格
export const DislikeBtn = props => (
  <Button
    className={styles.btn}
    icon="dislike"
    size={props.size || 'small'}
    onClick={props.onClick}
  >
    {props.text || '取消推荐'}
  </Button>
);

// 导出EXCEL 按钮 头部
export const ExCelBtn = props => (
  <Popover
    content="导出所有状态的下的商品，请确保您的电脑安装了OFFICE办公软件"
    title={
      <span>
        <Icon type="info-circle" style={{ color: 'orange', marginRight: 5 }} />
        提示
      </span>
    }
    placement="right"
  >
    <Button type="dashed" className={styles.btn} onClick={props.onClick}>
      导出EXCEL
    </Button>
  </Popover>
);
