import React, { useState, useEffect } from 'react';
import { Card } from 'antd';

const getSize = () => {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
};

function useWindowSize() {
  let [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
// const obj = {};
// obj.list = [1, 2, 3];
// obj.list.forEach(item => (item = item + 1));
// console.log(null);
export default () => {
  const windowSize = useWindowSize();
  return (
    <div style={{ padding: 20 }}>
      <Card>页面宽度：{windowSize.innerWidth}</Card>
      <Card>页面高度：{windowSize.innerHeight}</Card>
      <Card>页面宽度：{windowSize.outerWidth}</Card>
      <Card>页面高度：{windowSize.outerHeight}</Card>
    </div>
  );
};
