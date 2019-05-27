class Group {
  constructor(list = []) {
    this.list = list;
    this._result = [];
    this._results = [];
  }

  flatten(arr) {
    return [].concat(...arr.map(_ => (Array.isArray(_) ? this.flatten(_) : _)));
  }
  //  过滤摊平
  get arr() {
    // const arr = this.list.map((_, index) => {
    //   return _.boxList
    //     .filter(_ => _.checked === true)
    //     .map(_ => ({
    //       value: _.value,
    //       key: index,
    //     }));
    // });
    return this.flatten(this.filterChecked);
  }
  get groupBy() {
    const groups = this.groups;
    const groupBy = this.arr.reduce((groups, item) => {
      groups[item.key] = [...(groups[item.key] || []), item];
      return groups;
    }, {});
    return groupBy;
  }
  // 二维数组
  get dyadicArr() {
    const dyadicArr = Object.values(this.groupBy).map(_ => _.map(_ => _.value))
    return dyadicArr
  }

  doExchange(arr, index) {
    for (var i = 0; i < arr[index].length; i++) {
      this._result[index] = arr[index][i];
      if (index != arr.length - 1) {
        this.doExchange(arr, index + 1);
      } else {
        this._results.push(this._result.join(','));
      }
    }
  }
  get filterChecked() {
    const arr = this.list.map((_, index) => {
      return _.boxList
        .filter(_ => _.checked === true)
        .map(_ => ({
          value: _.value,
          key: index,
        }));
    });
    return arr
  }

  render() {
    if (!this.dyadicArr.length) return [];
    this.doExchange(this.dyadicArr, 0);
    return this._results;
  }

  static result(newList, oldValue, defaultPrice) {
    const group = new Group(newList)
    const list = group.render().map(_ => {
      const item = oldValue.find(item => item.val === _);
      return {
        val: _,
        price: item ? item.price : defaultPrice,
        nums: item ? item.nums : '',
      };
    });
    return list
  }
  static change2(goodParamsList, boxList, index) {
    const len = goodParamsList.length / boxList.length
    boxList.forEach((item, key) => {
      // item {value: "Apple", checked: true}
      // goodParamsList.forEach((_item) => {
      //   const valList = _item.val.split(",")
      //   valList[index] = item.value
      //   _item.val = valList.join(",")
      // })
    })
    console.log(boxList)
    console.log("12313", goodParamsList.length, len)
    let key = 0;
    for (let i = 0; i < goodParamsList.length; i += len) {
      const valList = goodParamsList[i].val.split(",")
      console.log('valList', valList, boxList, i)
      for (let j = 0; j < boxList.length; j++) {
        valList[index] = boxList[j].value
        key++
      }
      goodParamsList[i].val = valList.join(",")
    }
    return goodParamsList
  }
  static change(goodParamsList, boxList, index) {
    console.log('goodParamsList', goodParamsList)
    console.log('boxList', boxList)
    const len = goodParamsList.length / boxList.length
    let step = 0
    let record = 0
    // for(let i = 0;i<boxList.length;i++){
    //   const newValue = boxList[i].value
    //   for (const item of goodParamsList){
    //     const valueList = item.val.split(",")
    //     valueList[]

    //   }
    // }
    // for (const item of goodParamsList) {
    //   const valueList = item.val.split(",")
    //   valueList[index] = boxList[step].value

    // }
    for (let i = 0; i < goodParamsList.length; i++) {
      const valueList = goodParamsList[i].val.split(",")
      valueList[index] = boxList[step].value
      goodParamsList[i].val = valueList.join(",")
      record++
      if (record === len) {
        step++
        record = 0
      }
      // if (i !== 0 && i % len == 0) step++
    }
    return goodParamsList
  }
}
const valList = [
  ["Apple", "Orange"],
  ['pear', 'orange']
]
const boxList = [{
    value: "Apple1"
  },
  {
    value: "Pear1"
  }
]



export default Group;
