import React, { useState } from 'react';
import { Radio, DatePicker, Input, Button, Select } from 'antd';
const { RangePicker } = DatePicker;
const Search = Input.Search;
const Option = Select.Option;

// list 的数据格式
// const list = [
//   { value: 'state_all', txt: '全部 ' },
//   { value: 'state_received', txt: '待接单' },
//   { value: 'state_cooking', txt: '已下厨' },
//   { value: 'state_success', txt: '已完成' },
//   { value: 'state_cancel', txt: '已取消' },
// ];
export default props => {
  const list = [...props.list];
  const [searchType, setSearchType] = useState('buyer_name');
  const onChangeDate = (date, dateString) => {
    const [startTime, endTime] = dateString;
    props.onChange({
      start_time: startTime ? new Date(startTime) : '',
      end_time: endTime ? new Date(endTime) : '',
    });
  };
  const onSearch = value => {
    const obj =
      searchType === 'buyer_name'
        ? {
            buyer_name: value,
            sn: '',
          }
        : {
            sn: value,
            buyer_name: '',
          };
    props.onChange(obj);
  };
  return (
    <React.Fragment>
      <Radio.Group
        value={props.pageOpts.state_type}
        style={{ marginBottom: 16 }}
        onChange={e => props.onChange({ state_type: e.target.value })}
      >
        {list.map(({ value, txt }) => (
          <Radio.Button key={value} value={value}>
            {txt}
          </Radio.Button>
        ))}
      </Radio.Group>
      <span style={{ marginLeft: 50 }}>下单时间：</span>
      <RangePicker onChange={onChangeDate} />
      <Select
        style={{ width: 100, marginLeft: 20, marginRight: 5 }}
        onChange={value => setSearchType(value)}
        defaultValue={searchType}
      >
        <Option value="buyer_name">买家</Option>
        <Option value="sn">订单编号</Option>
      </Select>
      <Search
        style={{ display: 'inline-block', width: 300 }}
        placeholder="请输入你要查找的关键字"
        onSearch={value => onSearch(value)}
        enterButton
      />
    </React.Fragment>
  );
};
