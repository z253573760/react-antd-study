import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';

import Printer from '@uform/printer';
import { filter, withLatestFrom, map, debounceTime } from 'rxjs/operators';
import { getList } from '@/api/address';
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  Submit,
  Reset,
  FormItemGrid,
  FormCard,
  FormPath,
  FormBlock,
  FormLayout,
  createFormActions,
} from '@uform/antd';
const Address = () => {
  const [provinces, setProvinces] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { datas } = await getList('');
        setProvinces(datas.map(_ => ({ ..._, value: _.id, label: _.name })));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const effects = ($, { setFieldState, getFieldState }) => {
    const setEnum = (name, value) => {
      setFieldState(name, state => {
        state.props.enum = value;
      });
    };
    const setValue = (name, value) => {
      setFieldState(name, state => {
        state.value = value;
      });
    };

    $('onFieldChange', 'provinces').subscribe(async fieldState => {
      if (!fieldState.value) return;
      const { datas } = await getList(fieldState.value);
      setEnum('city', datas.map(_ => ({ ..._, value: _.id, label: _.name })));
      setValue('city', '');
    });
  };
  return (
    <SchemaForm
      effects={effects}
      onChange={v => console.log(v)}
      labelCol={4}
      wrapperCol={8}
      onSubmit={v => console.log(v)}
      inline
    >
      <Field name="provinces" type="string" enum={provinces} title="省份" />
      <Field type="string" name="city" title="城市" enum={[]} />
      <FormButtonGroup offset={6}>
        <Submit />
        <Reset />
      </FormButtonGroup>
    </SchemaForm>
  );
};
export default () => {
  const addressMsg = {
    value: '',
    child: {
      value: '',
    },
  };
  return (
    <div style={{ padding: 15 }}>
      <Card title="测试场景">
        <Address />
      </Card>
    </div>
  );
};
