import React from 'react';
import { Button, notification } from 'antd';
const test = {
  name: 'jack',
  getName: function() {
    console.log(this);
  },
};
const funcTest = test.getName;
test.getName();
funcTest();
export default class extends React.Component {
  handler = () => {
    console.log(this);
    notification.success({ message: '直接在 class 使用箭头函数' });
  };
  handler2() {
    console.log(this);
    notification.success({ message: '使用BIND' });
  }
  handler3() {
    console.log(this);
    notification.success({ message: '绑定事件的时候使用箭头函数' });
  }
  render() {
    return (
      <>
        <p>
          <Button onClick={this.handler}>直接在 class 使用箭头函数</Button>
        </p>
        <p>
          <Button onClick={this.handler2.bind(this)}>使用BIND</Button>
        </p>
        <p>
          <Button onClick={() => this.handler3()}>绑定事件的时候使用箭头函数</Button>
        </p>
      </>
    );
  }
}
