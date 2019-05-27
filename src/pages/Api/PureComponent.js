import React, { Fragment } from 'react';
let uid = 0;
export default class extends React.Component {
  state = {
    date: new Date(),
    valueObj: {
      bar: { value: 1 },
    },
  };
  componentDidMount() {
    const valueObj = this.state.valueObj;

    setInterval(() => {
      uid++;
      valueObj.bar.value = uid;
      this.setState({
        date: new Date(),
        valueObj,
      });
    }, 1000);
  }
  render() {
    return (
      <Fragment>
        <Child1 valueObj={this.state.valueObj} />
        <Child2 value={this.state.valueObj.bar.value} />
        <div>{this.state.date.toString()}</div>
      </Fragment>
    );
  }
}
class Child1 extends React.PureComponent {
  render() {
    console.log('child - render   child组件 重新渲染 ----- 深比较');
    return <div>Child组件 深比较 {this.props.valueObj.bar.value}</div>;
  }
}
class Child2 extends React.PureComponent {
  render() {
    console.log('child - render   child组件 重新渲染 ----- 浅比较');
    return <div>Child组件 浅比较 {this.props.value}</div>;
  }
}
