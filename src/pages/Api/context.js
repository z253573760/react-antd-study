import React, { Fragment } from 'react';

const defaultContext = React.createContext('default');
const barContext = React.createContext('bar');

function Parent() {
  return (
    <Fragment>
      <Son />
    </Fragment>
  );
}
function Son() {
  return (
    <Fragment>
      <Child />
    </Fragment>
  );
}

function Child() {
  return (
    <React.Fragment>
      <defaultContext.Consumer>{value => <div>{value}</div>}</defaultContext.Consumer>
      <barContext.Consumer>{value => <div>{value}</div>}</barContext.Consumer>
    </React.Fragment>
  );
}

export default () => {
  return (
    <React.Fragment>
      <h3>
        Context 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性。
      </h3>
      <defaultContext.Provider value={'我是default'}>
        <barContext.Provider value={'我是bar'}>
          <Parent />
        </barContext.Provider>
      </defaultContext.Provider>
    </React.Fragment>
  );
};
