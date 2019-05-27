import React from 'react';
import { Steps } from 'antd';
import { dateFormate } from '@/utils/tools';
const Step = Steps.Step;

export default props => {
  const { list, current, time } = props;
  const stepList = list || ['提交订单', '商家接单', '用户付款，完成订单'];

  return (
    <Steps current={current}>
      {stepList.map((_, index) => {
        let date = time[index];
        date = typeof date === 'string' ? dateFormate(date) : dateFormate(date * 1000);
        return <Step key={_} title={_} description={date} />;
      })}
    </Steps>
  );
};
