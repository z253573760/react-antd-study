import React, { Fragment, useState, useEffect } from 'react';

const MemoDemo1 = React.memo(props => {
  console.log('render 浅比较');
  return <div>memo-num 浅比较 {props.num}</div>;
});

const MemoDemo2 = React.memo(props => {
  console.log('render 深比较');
  return <div>memo-obj 深比较 {props.obj.bar.num}</div>;
});
const foo = { bar: { num: 0 } };
export default () => {
  const [num, setNum] = useState(0);
  const [obj, setObj] = useState(foo);
  useEffect(() => {
    setInterval(() => {
      setNum(prev => prev + 1);
      setObj(prev => {
        foo.bar.num = foo.bar.num + 1;
        return foo;
      });
    }, 1000);
  }, []);
  return (
    <Fragment>
      num: {num} obj: {obj.bar.num}
      <MemoDemo1 num={num} />
      <MemoDemo2 obj={obj} />
    </Fragment>
  );
};
