import React, { useState, useCallback } from 'react';
import { Tree, Input, Card } from 'antd';
const { TreeNode } = Tree;
const Search = Input.Search;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const SearchTree = props => {
  const { list: gData } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const dataList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key, title: node.title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(gData);
  const onChange = useCallback(e => {
    const value = e.target.value;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  }, []);
  const onExpand = useCallback(expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  }, []);
  const loop = useCallback(
    data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }

        return <TreeNode key={item.key} disableCheckbox={true} title={title} />;
      }),
    [searchValue]
  );

  return (
    <div>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {loop(gData)}
      </Tree>
    </div>
  );
};

const parse = list =>
  list.map(_ => ({
    ..._,
    key: _.id,
    title: _.departmentName,
    children: _.children ? parse(_.children) : null,
  }));
export default () => {
  const adepartmentTree = [
    {
      children: [
        {
          companyId: '418781263',
          departmentName: 'do sed consect',
          id: 29512416,
          parentId: 70662114,
        },
      ],
      companyId: '99853783',
      departmentName: 'consequat dolore',
      id: 47030960,
      parentId: 66406194,
    },
    {
      children: [
        {
          companyId: '320410061',
          departmentName: 'cillum officia',
          id: 33128623,
          parentId: 16312777,
        },
      ],
      companyId: '30410061',
      departmentName: 'labore eiusmod',
      id: 41129848,
      parentId: 28165003,
    },
  ];

  return (
    <div style={{ padding: 15 }}>
      <Card>
        <SearchTree list={parse(adepartmentTree)} />
      </Card>
    </div>
  );
};
