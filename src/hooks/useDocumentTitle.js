import { useState, useEffect } from 'react';

export default title => {
  useEffect(
    () => {
      document.title = title;
      return () => (document.title = '前端精读');
    },
    [title]
  );
};
