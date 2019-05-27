import React, { Component } from 'react';
import { Input, InputNumber, Card, Form } from 'antd';
import styles from './GoodsParams.less';

// export default props => {

//   return (
//     <div className={styles.warpper}>
//       <p className={styles.line} style={{ paddingTop: 23 }}>
//         <span className={styles.name}>商品规格配置</span>
//         <span className={styles.nums}>每日限量</span>
//         <span className={styles.price}>价格</span>
//       </p>
//       {props.list.map((item, index) => (
//         <p className={styles.line} key={index}>
//           <span className={styles.name}> {item.val}</span>
//           <Input
//             className={styles.nums}
//             value={item.nums}
//             placeholder="选填"
//             onChange={e => props.changeVal(e, 'nums', index)}
//           />
//           <Input
//             className={styles.price}
//             value={item.price}
//             onChange={e => props.changeVal(e, 'price', index)}
//           />
//         </p>
//       ))}
//     </div>
//   );
// };
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18, offset: 0 },
};
class TableGoodsParams extends Component {
  render() {
    const { props } = this;
    return (
      <div className={styles.warpper}>
        <p className={styles.line} style={{ paddingTop: 23 }}>
          <span className={styles.name}>商品规格配置</span>
          <span className={styles.nums}>每日限量</span>
          <span className={styles.price}>价格</span>
        </p>

        {props.list.map((item, index) => (
          <div className={styles.line} key={index}>
            <span className={styles.name}> {item.val}</span>
            <InputNumber
              className={styles.nums}
              style={{ marginTop: -6 }}
              value={item.nums}
              placeholder="选填"
              onChange={e => props.changeVal(e, 'nums', index)}
              precision={0}
            />
            <InputNumber
              className={styles.price}
              style={{ marginTop: -6 }}
              value={item.price || 0}
              min={0}
              onChange={e => props.changeVal(e, 'price', index)}
              precision={2}
            />
          </div>
        ))}
      </div>
    );
  }
}
export default TableGoodsParams;
