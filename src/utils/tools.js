export function dateFormate(_date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss') {
  const date = new Date(_date);
  const o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

export function debounce(func, delay = 300, I = null) {
  return (...args) => {
    clearInterval(I);
    I = setTimeout(func.bind(null, ...args), delay);
    // I = setTimeout((...args) => func(...args), delay)
  };
}
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
//将base64转换为文件
export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function jsonToFormData(json) {
  const param = new FormData();
  for (const i in json) {
    param.append(i, json[i]);
  }
  return param;
}
// array => json
export function arrayToJson(arr) {
  const json = {};
  arr.forEach((item, index) => {
    json[index] = item;
  });
  return json;
}
export function paraseGoodsClsName(arr, index = 0, str = '') {
  if (!arr[index]) return str;
  str = str + `>${arr[index].name}`;
  if (!arr[index].child.length) return str;
  return paraseGoodsClsName(arr, index + 1, str);
}
