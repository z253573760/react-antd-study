function observe(obj) {
  //  迭代对象的所有属性 并使用Object.defineProperty()转换成getter/setters
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key];
    //每一个属性分配一个 dep 实例
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        dep.depend();
        return internalValue;
      },
      set(newVal) {
        const changed = internalValue !== newVal;
        internalValue = newVal;
        //触发后重新计算
        if (changed) {
          dep.notify();
        }
      },
    });
  });
}
let activeUpdate = null;
//`wrappedUpdate`本质是一个闭包，
//`update`函数内部可以获取到`activeUpdate`变量，
//同理`dep.depend()`内部也可以获取到`activeUpdate`变量，所以`Dep`的实现就很简单了。
function autorun(update) {
  console.log('autorun');
  const wrappedUpdate = () => {
    activeUpdate = wrappedUpdate; // 引用赋值给activeUpdate
    update(); // 调用update，即调用内部的dep.depend
    activeUpdate = null; // 绑定成功之后清除引用
  };
  wrappedUpdate();
}
class Dep {
  constructor() {
    //消息队列?
    this.subscribers = new Set();
  }
  // 订阅update函数列表
  depend() {
    if (activeUpdate) {
      console.log(activeUpdate + '');
      this.subscribers.add(activeUpdate);
    }
  }
  // 所有update函数重新运行
  notify() {
    this.subscribers.forEach(sub => sub());
  }
}

const state = { count: 123 };
observe(state);

autorun(() => {
  console.log(state.count);
});

state.count++;
