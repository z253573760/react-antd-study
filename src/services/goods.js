import axios from '@/utils/axios';
import { jsonToFormData } from '@/utils/tools';

const config = {
  headers: { 'Content-Type': 'multipart/form-data' },
};
// 获取商品列表
export function getList(pageOpts) {
  return axios({
    method: 'POST',
    url: '/goods/goods_list',
    data: pageOpts,
  });
}

export function getStepOne(data = {}) {
  return axios({
    method: 'POST',
    url: '/goods/store_goods_add_step_one',
    data,
  });
}

// 获取商品详情
export function getGoodsDetail(common_id) {
  return axios({
    method: 'POST',
    url: '/goods/edit_catering_goods',
    data: { common_id },
  });
}

//批量删除商品
export function delGoods(goods_commonid) {
  return axios({
    method: 'POST',
    url: '/goods/goods_del',
    data: { goods_commonid },
  });
}

//商品上架/下架/推荐/取消推荐

export function goodsActions({ type, goods_commonid }) {
  return axios({
    method: 'POST',
    url: '/goods/goods_onoff_shelves',
    data: { goods_commonid, onoff: type },
  });
}

export function uploadImg(file, apic_type = 2) {
  return axios.post('/goods/upload_goods_image', jsonToFormData({ name: file, apic_type }), config);
}

// 发布商品-获取店铺商品分类
export function getGoodsClass() {
  return axios({
    method: 'POST',
    url: '/goods/get_store_goods_class',
  });
}

//5.8 发布商品-属性列表
export function getGoodsSpecifi(gc_id) {
  return axios({
    method: 'POST',
    url: '/goods/get_goods_specifi',
    data: { gc_id },
  });
}
//5.9 发布商品-添加属性参数
export function addSpecifiName({ name, spi_id, gc_id }) {
  return axios({
    method: 'POST',
    url: '/goods/add_specifi_name',
    data: { name, spi_id, gc_id },
  });
}
//5.10 发布商品 - 修改属性参数
export function editSpecifiName({ name, spi_id, spi_val_id }) {
  return axios({
    method: 'POST',
    url: '/goods/edit_specifi_name',
    data: { name, spi_id, spi_val_id },
  });
}

//5.11 发布商品-删除属性参数

export function delSpecifiName({ spi_id, spi_val_id }) {
  return axios({
    method: 'POST',
    url: '/goods/del_specifi_name',
    data: { spi_id, spi_val_id },
  });
}
//5.15 商品发布保存
export function addGoods(data) {
  return axios({
    method: 'POST',
    url: '/goods/save_goods',
    data,
  });
}
//5.18 商品编辑保存

export function editGoods(data) {
  return axios({
    method: 'POST',
    url: '/goods/edit_catering_goods_save',
    data,
  });
}
