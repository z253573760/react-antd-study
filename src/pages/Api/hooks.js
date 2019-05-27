import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Input } from 'antd';
const useInput = (defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);
  const handleChangeValue = useCallback(e => setValue(e.target.value), []);
  console.log('useInpit');
  useEffect(() => {
    console.log('component did mounted - 组件挂载');
    return () => {
      console.log('component did destory - 组件销毁');
    };
  }, []);
  return {
    onChange: handleChangeValue,
    value,
  };
};

export default () => {
  const inputProps = useInput();
  return (
    <Fragment>
      <p>value: {inputProps.value}</p>
      <Input style={{ width: 200 }} {...inputProps} />
    </Fragment>
  );
};
