import React from 'react';
import 'antd/dist/antd.css';

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

import { Button, Card } from 'antd';
import Printer from '@uform/printer';
const actions = createFormActions();
const App = props => {
  const submit = v => {
    console.log(v);
  };
  return (
    <div style={{ padding: 20 }}>
      <Card title="简单表单">
        <Printer>
          <SchemaForm
            onSubmit={submit}
            actions={actions}
            labelCol={7}
            wrapperCol={12}
            effects={($, { setFieldState }) => {
              $('onFormMount').subscribe(() => {
                setFieldState('radio', state => {
                  // state.required = true;
                });
              });
            }}
          >
            <Field
              type="radio"
              default="1"
              enum={[{ label: '苹果', value: 1 }]}
              title="Radio"
              name="radio"
              required
            />
            <Field
              default="1"
              type="string"
              enum={['1', '2', '3', '4']}
              required
              title="Select"
              name="select"
            />
            <Field
              type="checkbox"
              enum={['1', '2', '3', '4']}
              required
              title="Checkbox"
              name="checkbox"
            />
            <Field type="number" required title="数字选择" name="number" />
            <Field type="boolean" required title="开关选择" name="boolean" />
            <Field type="date" title="日期选择" name="date" />
            <Field
              type="daterange"
              title="日期范围"
              default={['2018-12-19', '2018-12-19']}
              name="daterange"
            />
            <Field type="year" title="年份" name="year" />
            <Field type="time" title="时间" name="time" />
            <Field
              type="upload"
              title="卡片上传文件"
              name="upload"
              x-props={{
                listType: 'card',
              }}
            />
            <Field
              type="upload"
              title="拖拽上传文件"
              name="upload2"
              x-props={{ listType: 'dragger' }}
            />
            <Field
              type="upload"
              title="普通上传文件"
              name="upload3"
              x-props={{ listType: 'text' }}
            />
            <Field
              type="range"
              title="范围选择"
              name="range"
              x-props={{ min: 0, max: 1024, marks: [0, 1024] }}
            />
            <Field type="transfer" title="穿梭框" name="transfer" />
            <Field type="rating" title="等级" name="rating" />
            <FormButtonGroup offset={7} sticky>
              <Submit />
              <Reset />
              <Button
                onClick={() => {
                  actions.setFieldState('upload', state => {
                    state.value = [
                      {
                        downloadURL: '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
                        imgURL: '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
                        name: 'doc.svg',
                      },
                    ];
                  });
                }}
              >
                上传文件
              </Button>
              <Button
                onClick={() => {
                  actions.setFormState(state => {
                    state.values = {
                      radio: '4',
                      checkbox: ['2', '3'],
                    };
                  });
                }}
              >
                改变radio的值
              </Button>
            </FormButtonGroup>
          </SchemaForm>
        </Printer>
      </Card>
    </div>
  );
};

export default App;
