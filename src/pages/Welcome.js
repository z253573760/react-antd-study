import React from 'react';
import { Button } from 'antd';
import axios from 'axios';
const url = 'https://api.zounian.cn/bapi/v340/area/get_open_city';
const LinkTo = async () => {
  // window.location.href = 'https://api.zounian.cn';
  // console.log(axios);
  const {
    data: {
      datas: { area_list },
    },
  } = await axios(url);
  // alert(area_list);
};
export default () => (
  <p style={{ textAlign: 'center' }}>
    <Button onClick={LinkTo}>iOS跳转</Button>
  </p>
);
