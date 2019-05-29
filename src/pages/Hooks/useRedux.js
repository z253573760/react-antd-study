import React, { Fragment, createContext, useContext, useReducer } from 'react';
import { Card, Button } from 'antd';

const ColorContext = createContext({});
const UPDATE_COLOR = 'UPDATE_COLOR';
const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_COLOR:
      return action.color;
    default:
      return state;
  }
};

const Color = props => {
  const [color, dispatch] = useReducer(reducer, 'blue');
  return (
    <ColorContext.Provider value={{ color, dispatch }}>{props.children}</ColorContext.Provider>
  );
};

const ShowArea = () => {
  const { color } = useContext(ColorContext);
  return <div style={{ marginTop: 10, color }}>字体颜色是BLUE</div>;
};
const Btns = () => {
  const { dispatch } = useContext(ColorContext);
  return (
    <Fragment>
      <Button
        style={{ marginRight: 10 }}
        onClick={() =>
          dispatch({
            type: UPDATE_COLOR,
            color: 'red',
          })
        }
      >
        红色
      </Button>
      <Button
        onClick={() =>
          dispatch({
            type: UPDATE_COLOR,
            color: 'yellow',
          })
        }
      >
        黄色
      </Button>
    </Fragment>
  );
};
export default () => {
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Color>
          <Btns />
          <ShowArea />
        </Color>
        <p>
          <a href="https://juejin.im/entry/5cebf5e751882530e4653767">参考文章</a>
        </p>
      </Card>
    </div>
  );
};
