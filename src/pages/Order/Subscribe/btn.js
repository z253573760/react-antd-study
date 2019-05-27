import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { Form, Button, Icon, Popconfirm, notification, Modal, Radio, Checkbox } from 'antd';
import { okSubscribe, cancelSubscribe } from '@/services/order';
const CheckboxGroup = Checkbox.Group;

export const DetailBtn = props => (
  <Button
    size={'small'}
    onClick={() => router.push(`/order/subscribe/detail?id=${props.reserve_id}`)}
  >
    订单详情
  </Button>
);

export const OkOrderBtn = props => {
  const { size, reserve_id } = props;
  const onConfirm = async () => {
    const data = await okSubscribe(reserve_id);
    if (data.code !== 200) {
      notification.error({
        message: '确认订单失败',
        description: data.error,
      });
      return;
    }
    notification.success({
      message: '确认订单成功',
    });
    props.cb && props.cb();
  };
  return (
    <Popconfirm
      title="是否确认接单?"
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      onConfirm={onConfirm}
    >
      <Button size={size || 'small'}>确认订单</Button>
    </Popconfirm>
  );
};
export const CancelOrderBtn = props => {
  const { reserve_id, goods_list, cb, size, reserve_sn, cancelList } = props;
  const [visible, setVisible] = useState(false);
  const [radioValue, setRadioValue] = useState(cancelList[0] || '餐位已满');
  const [loading, setLoading] = useState(false);
  const [checkValue, setCheckValue] = useState([]);
  const onChangeCheck = (checked, item) => {
    if (checked) {
      setCheckValue([...checkValue, item]);
      return;
    }
    setCheckValue(checkValue.filter(_ => _.goods_commonid !== item.goods_commonid));
  };
  console.log('checkValue', checkValue);
  const submit = async () => {
    setLoading(true);
    const data = await cancelSubscribe({ cancel_reason: checked, reserve_id });
    setLoading(false);
    if (data.code !== 200) {
      notification.error({
        message: '取消订单失败',
        description: data.error,
      });
    }
    notification.success({
      message: '取消订单成功',
    });
    setVisible(false);
    props.cb && props.cb();
  };
  return (
    <React.Fragment>
      <Modal
        title="取消订单"
        loading={loading}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
      >
        <p>订单编号：{reserve_sn}</p>
        <p>
          取消原因：
          {cancelList.map((item, index) => (
            <Radio
              key={index}
              value={item}
              checked={item === radioValue}
              onChange={e => setRadioValue(e.target.value)}
            >
              {item}
            </Radio>
          ))}
        </p>
        {radioValue === '缺少菜品' && (
          <React.Fragment>
            <div style={{ display: 'flex' }}>
              <div> 缺少菜品：</div>
              <div>
                {goods_list.map(_ => (
                  <p key={_.goods_commonid}>
                    <Checkbox onChange={e => onChangeCheck(e.target.checked, _.goods_commonid)}>
                      {_.goods_name} * {_.goods_num} ￥{_.goods_price}
                    </Checkbox>
                  </p>
                ))}
              </div>
            </div>
            <p style={{ marginLeft: 70, color: 'red' }}>请至少选择一项</p>
          </React.Fragment>
        )}
      </Modal>
      <Button size={size || 'small'} onClick={() => setVisible(true)}>
        取消订单
      </Button>
    </React.Fragment>
  );
};
