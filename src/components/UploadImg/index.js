import React, { Component } from 'react';
import { Upload, Icon, Modal, Button, notification, Checkbox } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './uploadImg.less';
import { isOss, getOss } from '@/services/utils';
import { uploadImg } from '@/services/goods';
import Oss from 'ali-oss';
import { dataURLtoFile } from '@/utils/tools';

class ImgUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: '', //裁剪图片的地址
      previewVisible: false, //图片预览的modal
      editImageModalVisible: false, // 裁剪弹窗显示的boolean
      previewImage: '', //图片预览的地址
      fileList: [], // 图片上传列表缩略图
      nums: props.nums,
      file: null,
    };
  }
  async componentWillMount() {
    this.props.onRef(this);
    await this.initOss();
  }
  async initOss() {
    const {
      datas: { ossopen },
    } = await isOss();
    if (ossopen !== 1) return;
    const { datas } = await getOss('goods_images');
    const client = new Oss({
      region: datas.region,
      accessKeyId: datas.AccessKeyId,
      accessKeySecret: datas.AccessKeySecret,
      bucket: datas.bucket,
      stsToken: datas.SecurityToken,
      // cname: true,
      // endpoint: `${datas.showurl}${datas.dir}`,
    });
    this.showUrl = datas.showurl;
    this.ClinetOss = client;
  }
  onRemove = file => {
    const { fileList } = this.state;
    const list = fileList.filter(_ => _.status === 'done');
    this.setState({ fileList: list });
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  componentWillReceiveProps(nextProps) {
    const { imgList } = nextProps;
    if (!imgList) return;
    this.setState({
      fileList: imgList.map(_ => ({
        url: _.img_path,
        name: _.img_name,
        status: 'done',
        uid: new Date().getTime(),
        checked: !!_.is_main,
      })),
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList });
  beforeUpload = (file, fileList) => {
    const isLt10M = file.size < 1 * 1024 * 1024;
    if (!isLt10M) {
      //添加文件限制
      notification.error({
        message: '上传失败',
        description: '请输入小于1M的图片',
      });
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      this.setState({
        file,
        src: e.target.result,
        editImageModalVisible: true,
      });
    };
    return false;
  };
  saveImg = async () => {
    const { fileList, file } = this.state;
    let imgUrl = '';
    let OssUrl = '';
    const resultFile = dataURLtoFile(this.cropper.getCroppedCanvas().toDataURL(), file.name);

    if (this.ClinetOss) {
      const { name } = await this.ClinetOss.multipartUpload(
        `/shop/store/goods/190/2019/02/27/${new Date().getTime()}`,
        resultFile
      );
      OssUrl = name;
    } else {
      const {
        datas: { image_url },
      } = await uploadImg(resultFile);
      imgUrl = image_url;
    }
    fileList.push({
      url: imgUrl ? imgUrl : `${this.showUrl}${OssUrl}`,
      name: OssUrl,
      status: 'done',
      uid: new Date().getTime(),
      checked: !fileList.length,
    });
    this.setState({
      editImageModalVisible: false,
      fileList,
    });
  };
  cancelCropperModal = () => {
    this.setState({
      editImageModalVisible: false,
    });
  };
  onChangeCheck = index => {
    const { fileList } = this.state;
    const result = fileList.map(_ => ({
      ..._,
      checked: false,
    }));
    result[index].checked = true;
    this.setState({
      fileList: result,
    });
  };
  submit() {
    const { fileList } = this.state;
    return fileList;
  }
  render() {
    const { previewVisible, previewImage, fileList, editImageModalVisible, nums } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>上传商品图片</div>
      </div>
    );
    const remark = (
      <div className={styles.remark}>
        <p>1、请使用jpg\jpeg\png等格式、 单张大小不超过1M的正方形图片</p>
        <p>2、上传图片最大尺寸将被保留为300像素</p>
        <p>3、通过更改排序数字修改商品图片在用户端的排列显示顺序</p>
        <p>4、图片质量要清晰，不能虚化，要保证亮度充足</p>
      </div>
    );
    return (
      <div className={styles['warpper']}>
        <Upload
          // action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove={this.onRemove}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= nums ? null : uploadButton}
        </Upload>
        <div className={styles['check-list-warpper']}>
          {fileList.map((_, index) => {
            return (
              <span className={styles['img-checked-warpper']} key={index}>
                <Checkbox checked={_.checked} onChange={() => this.onChangeCheck(index)}>
                  {_.checked ? '主图' : '  '}
                </Checkbox>
              </span>
            );
          })}
        </div>
        <Modal
          visible={previewVisible}
          footer={null}
          title="图片预览"
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal
          visible={editImageModalVisible}
          // centered={true}
          onCancel={this.cancelCropperModal}
          footer={
            <Button type="primary" onClick={this.saveImg}>
              保存
            </Button>
          }
          className={styles.modal}
          title="图片裁剪"
        >
          <Cropper
            style={{ width: 300, height: 300 }}
            aspectRatio={1}
            preview=".uploadCrop"
            guides={true}
            zoomable={false}
            src={this.state.src}
            aspectRatio={300 / 300}
            ref={cropper => (this.cropper = cropper)}
          />
          {remark}
        </Modal>
      </div>
    );
  }
}

export default ImgUpload;
