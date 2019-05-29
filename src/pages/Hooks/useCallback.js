import React, { useCallback, useState, useMemo } from 'react';
import { Card, Button, notification } from 'antd';

const a = 1;
const b = 2;

const test = {
  name: 'jack',
  getName: function() {
    console.log(this);
  },
};
const funcTest = test.getName;
test.getName();
funcTest();
export default () => {
  const [value, setValue] = useState(0);
  const func = (str = '') => {
    notification.success({ message: `${str} - 我被重新执行了` });
    return a + b;
  };
  const c = useCallback(
    str => {
      notification.success({
        message: `${str} - 我被重新执行了`,
      });
      return a + b;
    },
    [a, b]
  );
  const d = useMemo(() => func('useMemo'), [value]);
  console.log(d);
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <h3 />
        <p>
          value:{value} <Button onClick={() => setValue(v => v + 1)}>改变value</Button>
        </p>
        <p> no-useCallback : {func('no-useCallback')}</p>
        <p> useCallback : {c('useCallback')} </p>
        <p> useMemo : {d} </p>
      </Card>
    </div>
  );
};
