import React, { useState, useCallback } from 'react';
import { Tabs, Radio, Card } from 'antd';
import Context from './context';
import Hooks from './hooks';
import Children from './children';
import PureComponent from './PureComponent';
import Memo from './memo';
import Self from './self';
import useDocumentTitle from '@/hooks/useDocumentTitle';
const TabPane = Tabs.TabPane;

const list = [
  { name: 'context', component: <Context /> },
  { name: 'hooks', component: <Hooks /> },
  { name: 'children', component: <Children /> },
  { name: 'PureComponent', component: <PureComponent /> },
  { name: 'Memo', component: <Memo /> },
  { name: '事件绑定-this', component: <Self /> },
];
const useMode = defaultMode => {
  const [mode, setMode] = useState(defaultMode);
  const handleModeChange = useCallback(e => setMode(e.target.value), []);
  return {
    mode,
    handleModeChange,
  };
};

export default () => {
  const { mode, handleModeChange } = useMode('top');
  useDocumentTitle('v16-API');
  return (
    <Card>
      <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
        <Radio.Button value="top">Horizontal</Radio.Button>
        <Radio.Button value="left">Vertical</Radio.Button>
      </Radio.Group>
      <Tabs tabPosition={mode} style={{ height: 620 }}>
        {list.map(({ name, component }) => (
          <TabPane tab={name} key={name}>
            {component}
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
