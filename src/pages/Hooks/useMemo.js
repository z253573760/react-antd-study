import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, notification } from 'antd';

const Clild = ({ name, children }) => {
  function changeName(name) {
    notification.success({ message: '我被重新执行了' });
    return name + '改变name的方法';
  }
  // const otherName = changeName(name);
  const otherNameByMemo = useMemo(() => changeName(name), [name]);
  return (
    <>
      {/* <div>{otherName}</div> */}
      <div>{otherNameByMemo}</div>
      <div>{children}</div>
    </>
  );
};
const style = {
  marginLeft: 10,
};
export default () => {
  const [name, setName] = useState('名称');
  const [content, setContent] = useState('内容');
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <h3>
          使用 memo 包裹的组件，会在自身重渲染时，对每一个 props
          项进行浅对比，如果引用没有变化，就不会触发重渲染。所以 memo 是一种很棒的性能优化工具。
        </h3>
        <Card>
          name:{name}
          <Button style={style} onClick={() => setName(new Date().getTime())}>
            改变 - name
          </Button>
        </Card>
        <Card>
          content:{content}
          <Button style={style} onClick={() => setContent(new Date().getTime())}>
            改变 - content
          </Button>
        </Card>
        <Card>
          <Clild name={name}>{content}</Clild>
        </Card>
      </Card>
    </div>
  );
};
