---
title: JavaScript设计模式--策略模式
date: 2019-02-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

**策略模式就是定义一系列的算法，把他们各自封装成策略类，算法被封装在策略类内部的方法里。在客户端对Context发起请求时，Context总是把请求委托给这些策略对象中间的某一个进行计算。**

其次，策略模式是符合软件设计中单一职责原则的，Context充当的是代理的角色，具体的业务业务逻辑是交给对应的策略类来实现的，策略类中的方法都是单独存在的个体，之间没有耦合，如下图所示：

![img](http://lcbblog.com/images/Strategy/Strategy.png)

客户端的每个请求，在策略类中都应该有一个对应的处理方法，属于一一对应关系。很多人可能会有疑问，明明“**两点之间直线最短**”，为什么还要绕一大圈，以此种方式去实现呢？需要**维护一个中间件Context类**确实是策略模式的一个局限性，但是与其优点相对，这个缺点可以暂时忽略不计。其主要优点是增加**代码的健壮性与可扩展性**。当我们新增一个处理逻辑时，不需要改动以前的逻辑，只需要新增一个策略类处理逻辑即可，在生产环境中，任何一个细小的改动都可能带来一系列意想不到的结果。除此之外，策略类中的实现方法时相互独立的，可以**降低不同业务处理之间的业务耦合**，以降低代码出错的风险，**增加代码的容错能力**。

在实际生产应用中，具有大量业务处理分支且可以归纳提炼为不同的业务流程的，都可以采用策略模式来设计代码，比较经典的案例就是表单验证，本文以**表单验证**为例，来介绍策略模式在实际开发中的使用。

策略模式最起码由两部分组成：

　　　　**1、策略类**

　　　　　　封装某个策略的具体实现方法

　　　　**2、环境类Context**

　　　　　　接收客户端业务处理请求，根据请求参数，调用策略类中具体的实现方法，策略类中必须要有处理方法；

　　以表单验证为例，其策略模式的实现过程如下：

```
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
/**
 * 策略实现类
 */
const validateStrategies = {
    checkPattern: {
        mobileReg: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/,
        numReg: /^[0-9]+(\.[0-9]{1,2})?$/
    },
    validateMobile(item) {
        let flag = true;
        if (item.data && !this.checkPattern.mobileReg.test(item.data)) {
            flag = false;
        }
        return flag;
    },
    validateNumber(item) {
        let flag = true;
        if (!this.checkPattern.numReg.test(item.data)) {
            flag = false;
        } else if (item.point) {
            let pattern = new RegExp(`^[0-9]+(\.[0-9]{1,${item.point}})?$`);
            if (!pattern.test(item.data)) {
                flag = false;
            }
        }
        return flag;
    },
    //校验字段是否必填
    validateRequired(item) {
        let flag = true;
        if (!item.data) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    }
};


class ValidateForm {

    constructor() {
        this.cache = [];
    }

    add(rules) {
        if (Array.isArray(rules)) {
            this.cache = [...this.cache, ...rules];
        } else if (isObject(rules)) {
            this.cache = [...this.cache, rules];
        } else {
            messagee.error(`参数类型应该为Object或Array，但是却传入了${typeof rules}`, 2);
        }

    }

    remove(id) {
        let index = this.cache.findIndex(vv => vv.id && Object.is(vv.id, id));
        this.cache.splice(index, 1);
    }

    start() {
        for (let i = 0, len = this.cache.length; i < len; i++) {
            let item = this.cache[i];
            //传入的验证方法必须是一个function
            if (!isFunction(validateStrategies[item.validateFun])) {
                message.error('表单校验参数格式错误', 2);
                return false;
            } else {
                let flag = validateStrategies[item.validateFun](item);
                if (!flag) {
                    return flag;
                }
            }
        }
        return true;
    }
}

export default ValidateForm;
```

我们声明了一个ValidateForm类和一个validateStrategies策略对象，策略对象中封装了一些表单验证方法，在实例化Validate表单验证类的时候，需要往表单验证类中注入特定的表单校验规则，然后调用下启动方法，就能得到表单验证结果，以上代码使用过程如下：

```
let validate = new ValidateForm();
validate.add(rules:Array<Object>) // 加入验证规则 
validate.start() // 开始校验 
@param rules:Array<Object> {
  validateFun: '', // 校验方法
  data: '',// 校验的数据
  maxSize: '', // 最大值
  ponit: '' // 小数点
  ...
}
```

