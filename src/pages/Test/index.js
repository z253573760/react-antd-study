import React from 'react';
import { connect } from 'dva';
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
const Extends = () => {
  function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sing = function() {
      console.log(`${this.name}- sing `);
    };
  }
  Person.prototype.run = function() {
    console.log(`${this.name}- run `);
  };

  function Man(name, age) {
    Person.call(this, name, age);
  }

  Man.prototype = Object.create(Person.prototype);
  Man.prototype.constructor = Man;

  const xiaoming = new Man('小明', 18);
  xiaoming.run();
  xiaoming.sing();
  console.log(Person.prototype);
  const list = [1, 2, 3];
  list[10] = 10;
  console.log(list);
  for (const item of list) {
    console.log(item);
  }
  const arr = list.filter(_ => _ === undefined);
  console.log('arr', arr);
  return <Card>{'str'}</Card>;
};

const Created = () => {
  const person = {
    isHuman: false,
    printIntroduction: function() {
      console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
    },
  };
  const me = {};
  console.log(me);
  return <>Object.created</>;
};
const list = [
  { name: 'Object.created', component: <Created /> },
  { name: '继承', component: <Extends /> },
  { name: '柯里化函数', component: <CurryFunc /> },
  { name: '惰性函数', component: <LazyFunc /> },
];
const App = props => {
  console.log('props', props);
  const result = props.dispatch({ type: 'user/test' });
  result.then(res => {
    console.log('res', res);
  });
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

export default connect(state => {
  console.log('state', state);
  return {};
})(App);
