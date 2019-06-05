import React from 'react';
import { Card, Tabs } from 'antd';
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

const list = [{ name: '惰性函数', component: <LazyFunc /> }];
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
