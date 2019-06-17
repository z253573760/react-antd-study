import React from 'react';
import { Card, Tabs } from 'antd';
import AddRole from './AddRole';
const TabPane = Tabs.TabPane;

const LazyFunc = () => {
  let foo = function() {
    const t = new Date();
    foo = function() {
      return t;
    };
    return foo();
  };
  return (
    <Card>
      {[1, 2, 3, 4, 5].map(_ => (
        <div key={_}>
          {`第${_}次调用：`} {foo().toString()}
        </div>
      ))}
    </Card>
  );
};
const CurryFunc = () => {
  function curry(fn) {
    var args = [].slice.call(arguments, 1);

    function inner() {
      var arg = [].slice.call(arguments);
      args = args.concat(arg);
      return inner;
    }
    inner.toString = function() {
      return fn.apply(this, args);
    };

    return inner;
  }
  const add = (...args) => args.reduce((v1, v2) => v1 + v2);

  var curryAdd = curry(add);
  console.log(curryAdd(1)(2)(3));
  return <Card>{}</Card>;
};
const InstanceOfFunc = () => {
  const list = [
    '新宿区     豊岛区     台东区     港区     渋谷区     板桥区     江东区     中央区     文京区     世田谷区     练马区     品川区     杉并区     大田区     墨田区     北区     中野区     ',
  ];

  const arr = list[0].split('区').map(_ => `${_.trim()}区`);
  console.log(arr);
  return <Card>{'str'}</Card>;
};
// class Child extends React.Component {
//   render() {
//     console.log('render');
//     return <div>{this.props.value}</div>;
//   }
// }
const Child = props => {
  console.log('render');
  return <div>{props.value}</div>;
};
class Foo extends React.Component {
  state = {
    a: 1,
  };
  render() {
    return (
      <>
        <div onClick={() => this.setState({ a: 3 })}>btn</div> <Child value={this.state.a} />
      </>
    );
  }
}
const list = [
  { name: 'InstanceOf', component: <AddRole /> },
  { name: '柯里化函数', component: <CurryFunc /> },
  { name: '惰性函数', component: <LazyFunc /> },
];
export default () => {
  return (
    <Card>
      <Tabs tabPosition="top" style={{ height: 620 }}>
        {list.map(({ name, component }) => (
          <TabPane tab={name} key={name}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
