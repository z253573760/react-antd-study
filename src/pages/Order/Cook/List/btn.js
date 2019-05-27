import React, { useState } from 'react';
import router from 'umi/router';
import { Popconfirm, Button, Icon, notification, Modal, InputNumber, Input, Radio } from 'antd';
import { okCook, editCook, cancelCook } from '@/services/order';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

function useModalVisible() {
  const [visible, setVisible] = useState(false);
  return {
    visible,
    setVisible,
  };
}

export const OkOrderBtn = props => {
  const { order_id, getList, size } = props;
  const onConfirm = async () => {
    const data = await okCook(order_id);
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
export const DetailBtn = props => {
  return (
    <Button onClick={() => router.push(`/order/cook/detail?id=${props.order_id}`)} size="small">
      订单详情
    </Button>
  );
};
export const ChangePriceBtn = props => {
  const { order_id, order_amount, size } = props;
  const { visible, setVisible } = useModalVisible();
  const [price, setPrice] = useState(null);
  const submit = async () => {
    const data = await editOrder({
      order_id,
      type: 'edit_price',
      number: price,
    });
    if (data.code !== 200) {
      notification.error({
        message: '修改价格失败',
        description: data.error,
      });
      return;
    }
    notification.success({
      message: '修改价格成功',
    });
    setVisible(false);
  };
  return (
    <React.Fragment>
      <Button size={size || 'small'} onClick={() => setVisible(true)}>
        修改价格
      </Button>
      <Modal title="减免金额" visible={visible} onOk={submit} onCancel={() => setVisible(false)}>
        <InputNumber
          max={Number(order_amount) - 0.01}
          min={0}
          style={{ width: '100%' }}
          defaultValue={price}
          placeholder="请输入减免金额"
          onChange={value => setPrice(value)}
        />
      </Modal>
    </React.Fragment>
  );
};
export const ChangePeopleNum = props => {
  const { number_of_people, order_id, size } = props;
  //const [visible, setVisible] = useState(false);
  const { visible, setVisible } = useModalVisible();
  const [number, setNumber] = useState(null);
  const submit = async () => {
    const data = await editCook({
      order_id,
      type: 'number_of_people',
      number,
    });
    if (data.code !== 200) {
      notification.error({
        message: '修改用餐人数失败',
        description: data.error,
      });
      return;
    }
    notification.success({
      message: '修改用餐人数成功',
    });
    setVisible(false);
  };
  return (
    <React.Fragment>
      <Button size={size || 'small'} onClick={() => setVisible(true)}>
        修改用餐人数
      </Button>
      <Modal
        title="修改用餐人数"
        visible={visible}
        onOk={submit}
        onCancel={() => setVisible(false)}
      >
        <InputNumber
          style={{ width: '100%' }}
          defaultValue={parseInt(number_of_people)}
          placeholder="请输入减免金额"
          onChange={value => setNumber(value)}
        />
      </Modal>
    </React.Fragment>
  );
};
export const PayOrderBtn = props => {
  const { order_id, getList, size } = props;
  const onConfirm = async () => {
    const data = await editCook({
      order_id,
      type: 'confirm',
    });
    if (data.code !== 200) {
      notification.error({
        message: '确认收款失败',
        description: data.error,
      });
      return;
    }
    notification.success({
      message: '确认收款成功',
    });
    props.cb && props.cb();
  };
  return (
    <Popconfirm
      title="请确认用户用餐结束并在线下付款再点确认?"
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      onConfirm={onConfirm}
    >
      <Button size={size || 'small'}>确认收款</Button>
    </Popconfirm>
  );
};
export const SetOrderParentBtn = props => {
  const { order_id, getList, size } = props;
  const onConfirm = async () => {
    const data = await editCook({
      order_id,
      type: 'turn_to_order',
    });
    if (data.code !== 200) {
      notification.error({
        message: '转为主订单失败',
        description: data.error,
      });
      return;
    }
    notification.success({
      message: '转为主订单成功',
    });
    props.cb && props.cb();
  };
  return (
    <Popconfirm
      title="转为主订单后无法撤销?"
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      onConfirm={onConfirm}
    >
      <Button size={size || 'small'}>转为主订单</Button>
    </Popconfirm>
  );
};

export const CancelOrderBtn = props => {
  const { order_id, getList, size, order_sn, cancelList } = props;
  const { visible, setVisible } = useModalVisible();
  const [checked, setChecked] = useState(cancelList[0] || '顾客要求取消');
  const [other, setOther] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    const cancel_reason = checked === '其他原因' ? other : checked;
    setLoading(true);
    const data = await cancelCook({ cancel_reason, order_id });
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
        <p>订单编号：{order_sn}</p>
        <p>
          取消原因：
          {cancelList.map((item, index) => (
            <Radio
              key={index}
              value={item}
              checked={item === checked}
              onChange={e => setChecked(e.target.value)}
            >
              {item}
            </Radio>
          ))}
        </p>
        <TextArea
          placeholder="请输入其他原因 不超过50个字"
          autosize={{ minRows: 2, maxRows: 6 }}
          disabled={checked !== '其他原因'}
          maxLength="50"
          value={other}
          onChange={e => setOther(e.target.value)}
        />
      </Modal>
      <Button size={size || 'small'} onClick={() => setVisible(true)}>
        取消订单
      </Button>
    </React.Fragment>
  );
};

export const CorrelationOrder = props => {
  const { size } = props;
  <Button size={size || 'small'}>查看关联预约单</Button>;
};
