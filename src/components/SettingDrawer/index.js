import React, { useState } from 'react';
// import { Drawer } from '@/components/SettingDrawer/node_modules/antd';
import { Button, Switch, Drawer, Tooltip, Icon } from 'antd';
import styles from './index.less';

const BlockChecbox = ({ list, value, onChange }) => {
  return (
    <div className={styles.flex}>
      {list.map(({ title, key, url }) => (
        <Tooltip title={title} key={key}>
          <div className={styles['tooltip-warpper']} onClick={() => onChange(key)}>
            <img src={url} />
            <div
              style={{
                display: value === key ? 'block' : 'none',
              }}
            >
              <Icon type="check" />
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

const themelist = [
  {
    key: 'dark',
    url: 'https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg',
    title: '暗色菜单风格',
  },
  {
    key: 'light',
    url: 'https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg',
    title: '亮色菜单风格',
  },
];
const layoutList = [
  {
    key: 'sidemenu',
    url: 'https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg',
    title: '侧边导航',
  },
  {
    key: 'topmenu',
    url: 'https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg',
    title: '顶部导航',
  },
];
export default props => {
  const [visible, setVisible] = useState(true);
  const changeSetting = (key, value) => {
    const { setting, dispatch } = props;
    const nextState = { ...setting };
    nextState[key] = value;
    if (key === 'layout') {
      nextState.contentWidth = value === 'topmenu' ? 'Fixed' : 'Fluid';
    } else if (key === 'fixedHeader' && !value) {
      nextState.autoHideHeader = false;
    }
    dispatch({
      type: 'setting/changeSetting',
      payload: nextState,
    });
  };
  return (
    <div className={styles.warpper}>
      {!visible ? (
        <Button type="primary" size="large" icon="setting" onClick={() => setVisible(true)} />
      ) : null}
      <Drawer placement="right" closable onClose={() => setVisible(false)} visible={visible}>
        <div className={styles.line} style={{ marginBottom: 5 }}>
          风格设置
        </div>
        <BlockChecbox
          list={themelist}
          value={props.navTheme}
          onChange={value => changeSetting('navTheme', value)}
        />
        <div className={styles.line} style={{ marginBottom: 5 }}>
          导航模式
        </div>
        <BlockChecbox
          list={layoutList}
          value={props.layout}
          onChange={value => changeSetting('layout', value)}
        />

        <div className={styles.line}>
          <span className={styles.label}>固定侧边菜单 ：</span>
          <Switch
            style={{ marginTop: -3 }}
            size="small"
            checked={!!props.fixSiderbar}
            onChange={checked => changeSetting('fixSiderbar', checked)}
          />
        </div>
        <div className={styles.line}>
          <span className={styles.label}>固定头部 ：</span>
          <Switch
            style={{ marginTop: -3 }}
            size="small"
            checked={!!props.fixedHeader}
            onChange={checked => changeSetting('fixedHeader', checked)}
          />
        </div>
        <div className={styles.line}>
          <span className={styles.label}>下滑时隐藏头部 ：</span>
          <Switch
            style={{ marginTop: -3 }}
            size="small"
            disabled={!props.fixedHeader}
            checked={!!props.autoHideHeader}
            onChange={checked => changeSetting('autoHideHeader', checked)}
          />
        </div>
      </Drawer>
    </div>
  );
};
