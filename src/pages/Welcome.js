import React from 'react';
import { Button } from 'antd';
const LinkTo = () => {
  window.location.href = 'https://api.zounian.cn';
};
export default () => (
  <p style={{ textAlign: 'center' }}>
    <Button onClick={LinkTo}>iOS跳转</Button>
  </p>
);
