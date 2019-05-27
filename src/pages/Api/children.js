import React from 'react';
import useDocumentTitle from '@/hooks/useDocumentTitle';
function ClidrenDemo(props) {
  console.log(props.children);
  console.log(React.Children.map(props.children, c => [c, [c, c]]));
  return props.children;
}

export default () => {
  useDocumentTitle('children');
  return (
    <ClidrenDemo>
      <span>1</span>
      <span>2</span>
    </ClidrenDemo>
  );
};
