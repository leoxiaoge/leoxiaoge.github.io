---
title: Vue3.x 生命周期 和 Composition API 核心语法理解
date: 2020-04-22
tags:
 - Vue
categories:
 -  Vue
---

## **1 Vue2.x 生命周期回顾**

1. `beforeCreate`，在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
2. `created`，在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前尚不可用。
3. `beforeMount`，在挂载开始之前被调用：相关的 render 函数首次被调用。
4. `mounted`，实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当mounted被调用时 `vm.$el` 也在文档内。
5. `beforeUpdate`，数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
6. `updated`，由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
7. `activated`，被 keep-alive 缓存的组件激活时调用。
8. `deactivated`，被 keep-alive 缓存的组件停用时调用。
9. `beforeDestroy`，实例销毁之前调用。在这一步，实例仍然完全可用。
10. `destroyed`，实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。
11. `errorCaptured`，当捕获一个来自子孙组件的错误时被调用。

参考：https://cn.vuejs.org/v2/api/#选项-生命周期钩子

以下是整个生命周期图示：

![img](https://cn.vuejs.org/images/lifecycle.png)

参考：https://cn.vuejs.org/v2/guide/instance.html#生命周期图示

## **2 Vue3.x 生命周期变化**

***\*被替换\****

1. beforeCreate -> setup()
2. created -> setup()

***\*重命名\****

1. beforeMount -> onBeforeMount
2. mounted -> onMounted
3. beforeUpdate -> onBeforeUpdate
4. updated -> onUpdated
5. beforeDestroy -> onBeforeUnmount
6. destroyed -> onUnmounted
7. errorCaptured -> onErrorCaptured

***\*新增的\****

新增的以下2个方便调试 `debug` 的回调钩子：

1. onRenderTracked
2. onRenderTriggered

参考：https://vue-composition-api-rfc.netlify.com/api.html#lifecycle-hooks

***\*特别说明\****

由于 Vue3.x 是兼容 Vue2.x 的语法的，因此为了保证 Vue2.x 的语法能正常在 Vue3.x 中运行，大部分 Vue2.x 的回调函数还是得到了保留。比如：虽然 `beforeCreate` 、 `created` 被 `setup()` 函数替代了，也就是说在 Vue3.x 中建议使用 `setup()`，而不是旧的API，但是如果你要用，代码也是正常执行的。

但是，以下2个生命周期钩子函数被改名后，在 Vue3.x 中将不会再有 `beforeDestroy` 和 `destroyed`。

1. beforeDestroy -> onBeforeUnmount
2. destroyed -> onUnmounted

另外，假如 Vue3.x 在 Q2 如期 Release 的话，大家一定要注意，在混合使用 Vue2.x 和 Vue3.x 语法的时候，特别要注意这2套API的回调函数的执行顺序。

## **3 Vue2.x + Composition API 对比 Vue3.x 生命周期执行顺序**

当 Vue3.x 正式 Realease 以后，我可能会先使用 `Vue2.x + Composition API`，完了再使用 `Vue3.x` 搭建新的基础框架。

那我今天主要关心的一个问题，一旦我使用 `Vue2.x + Composition API` 进入过渡期后，当我再使用 `Vue3.x` 搭建新的框架，那么之前的基础组件还能使用么？

先测试下生命周期函数的执行顺序。

### **3.1 Vue2.x + Composition API 生命周期执行顺序**

如下示例，在 Vue2.x 中引入兼容包 Composition API，然后Vue2.x 和 Vue3.x 的生命周期函数混合使用。

```
<template>
    <div>
        <p> {{ id }} </p>
        <p> {{ name }} </p>
    </div>
</template>
<script>
    import {
        ref,
        onBeforeMount,
        onMounted,
        onBeforeUpdate,
        onUpdated,
        onBeforeUnmount,
        onUnmounted
    } from '@vue/composition-api';

    export default {
        setup() {
            const id = ref(1)

            console.log('setup')

            onBeforeMount(() => {
                console.log('onBeforeMount')
            })
            onMounted(() => {
                console.log('onMounted')
            })
            onBeforeUpdate(() => {
                console.log('onBeforeUpdate')
            })
            onUpdated(() => {
                console.log('onUpdated')
            })
            onBeforeUnmount(() => {
                console.log('onBeforeUnmount')
            })
            onUnmounted(() => {
                console.log('onUnmounted')
            })

            // 测试 update 相关钩子
            setTimeout(() => {
                id.value = 2
            }, 2000)

            return {
                id
            }
        },
        data() {
            console.log('data')
            return {
                name: 'lilei'
            }
        },
        beforeCreate() {
            console.log('beforeCreate')
        },
        created() {
            console.log('created')
        },
        beforeMount() {
            console.log('beforeMount')
        },
        mounted() {
            console.log('mounted')
            setTimeout(() => {
                this.id = 3;
            }, 4000)
        },
        beforeUpdate() {
            console.log('beforeUpdate')
        },
        updated() {
            console.log('updated')
        },
        beforeUnmount() {

        },
        unmounted() {
            console.log('unmounted')
        },
        beforeDestroy() {
            console.log('beforeDestroy')
        },
        destroyed() {
            console.log('destroyed')
        }
    }
</script>
```

执行结果：

```
1. beforeCreate
2. setup
3. data
4. created
5. beforeMount
6. onBeforeMount
7. mounted
8. onMounted
9. beforeUpdate
10. onBeforeUpdate
11. updated
12. onUpdated
13. beforeDestroy
14. onBeforeUnmount
15. destroyed
16. onUnmounted
```

***\*结论\****

在 `Vue2.x` 中通过补丁形式引入 `Composition API`，进行 `Vue2.x` 和 `Vue3.x` 的回调函数混用时：**Vue2.x 的回调函数会相对先执行**，比如：`mounted` 优先于 `onMounted`。

### **3.2 Vue3.x 生命周期执行顺序**

以下直接使用 Vue3.x 语法，看看其在兼容 Vue2.x 情况下，生命周期回调函数混合使用的执行顺序。

```
<template>
    <div>
        <p> {{ id }} </p>
        <p> {{ name }} </p>
    </div>
</template>

<script>
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onRenderTracked,
    onRenderTriggered
} from 'vue';

export default {
    setup() {
        const id = ref(1)

        console.log('setup')

        onBeforeMount(() => {
            console.log('onBeforeMount')
        })
        onMounted(() => {
            console.log('onMounted')
        })
        onBeforeUpdate(() => {
            console.log('onBeforeUpdate')
        })
        onUpdated(() => {
            console.log('onUpdated')
        })
        onBeforeUnmount(() => {
            console.log('onBeforeUnmount')
        })
        onUnmounted(() => {
            console.log('onUnmounted')
        })
        onRenderTracked(() => {
            console.log('onRenderTracked')
        })
        onRenderTriggered(() => {
            console.log('onRenderTriggered')
        })

        // 测试 update 相关钩子
        setTimeout(() => {
            id.value = 2;
        }, 2000)

        return {
            id
        }
    },
    data() {
        console.log('data')
        return {
            name: 'lilei'
        }
    },
    beforeCreate() {
        console.log('beforeCreate')
    },
    created() {
        console.log('created')
    },
    beforeMount() {
        console.log('beforeMount')
    },
    mounted() {
        console.log('mounted')
        setTimeout(() => {
            this.id = 3;
        }, 4000)
    },
    beforeUpdate() {
        console.log('beforeUpdate')
    },
    updated() {
        console.log('updated')
    },
    beforeUnmount() {
        console.log('beforeUnmount')
    },
    unmounted() {
        console.log('unmounted')
    }
}
</script>

<style scoped></style>
```



执行结果：

```
1. beforeCreate
2. data
3. created
4. onRenderTracked
5. onRenderTracked
6. onBeforeMount
7. beforeMount
8. onMounted
9. mounted
10. onRenderTriggered
11. onRenderTracked
12. onRenderTracked
13. onBeforeUpdate
14. beforeUpdate
15. onUpdated
16. updated
17. onBeforeUnmount
18. beforeUnmount
19. onUnmounted
20. unmounted
```

***\*结论\****

在 `Vue3.x` 中，为了兼容 `Vue2.x` 的语法，所有旧的生命周期函数得到保留（除了 `beforeDestroy` 和 `destroyed`），当生命周期混合使用时：**Vue3.x 的生命周期相对优先于 Vue2.x 的执行**，比如：`onMounted` 比 `mounted` 先执行。

## **4 Vue2.x + Composition API 过度到 Vue3.x 生命周期总结**

综上所述：

- 在 `Vue2.x` 中通过补丁形式引入 `Composition API`，进行 `Vue2.x` 和 `Vue3.x` 的回调函数混用时：**Vue2.x 的回调函数会相对先执行**，比如：`mounted` 优先于 `onMounted`。
- 在 `Vue3.x` 中，为了兼容 `Vue2.x` 的语法，所有旧的生命周期函数得到保留（除了 `beforeDestroy` 和 `destroyed`）。当生命周期混合使用时：**Vue3.x 的生命周期相对优先于 Vue2.x 的执行**，比如：`onMounted` 比 `mounted` 先执行。

通过对比可以得出：**当你的主版本是哪个，当生命周期混用时，谁的回调钩子就会相对优先执行。**

所以，这里就会有点坑！为了给减小以后不必要的麻烦，如果大家在 `Vue2.x` 中通过补丁形式引入 `Composition API`的使用的时候，建议：

1. **不要混用Vue2.x和Vue3.x的生命周期**。要么你继续使用 Vue2.x 的钩子函数，要么使用 Vue3.x 的钩子函数，这样就没问题。
2. 在原则1的情况下，**建议源码从工程或者目录就区分开新老版本**。方便以后升级或者被引入到 Vue3.x 使用的时候，更有针对性兼容测试。

## **5 Composition API 核心语法**

以下内容，大部分参考官方：Vue Composition API（https://vue-composition-api-rfc.netlify.com/api.html）

### **5.1 setup 主执行函数**

`setup` 是 Composition API 的核心，可以说也是整个 Vue3.x 的核心。

- `setup` 就是将 Vue2.x 中的 `beforeCreate` 和 `created` 代替了，以一个 `setup` 函数的形式，可以灵活组织代码了。
- `setup` 还可以 return 数据或者 template，相当于把 `data` 和 `render` 也一并代替了！

为什么说 `setup` 灵活了呢？因为在这个函数中，每个生命周期可以是一个函数，在里面执行，以函数的方式编程。

下面看看其几个核心特点：

***\*1 返回一组数据给template\****

```
<template>
  <div>{{ count }} {{ object.foo }}</div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const object = reactive({ foo: 'bar' })

    // expose to template
    return {
      count,
      object
    }
  }
}
</script>
```

***\*2 使用jsx语法\****

```
<script>
import { h, ref, reactive } from 'vue'
export default {
    setup() {
        const count = ref(0)
        const object = reactive({ foo: 'bar' })

        return () => h('div', [
            h('p', { style: 'color: red' }, count.value),
            h('p', object.foo)
        ])
    }
}
</script>
```

***\*3 Typescript Type\****

```
interface Data {
  [key: string]: unknown
}

interface SetupContext {
  attrs: Data
  slots: Slots
  emit: ((event: string, ...args: unknown[]) => void)
}

function setup(
  props: Data,
  context: SetupContext
): Data
```

***\*4 参数\****

需要注意的是，在 `setup` 函数中，取消了 `this`！两方面的原因：

1. 由于 `setup` 是一个入口函数，本质是面向函数编程了，而 `this` 是面向对象的一种体现！在完全基于函数的编程世界中，这个 `this` 就很难在能达到跟 Vue2.x 那种基于 OOP 思想的 Options 机制的实现的效果。

2. 同样是基于函数式编程，那么如果加上 this，对于新手而言，本来 this 就不好理解，这时候就更加懵逼了。比如：

   ```
   setup() {
     function onClick() {
       this // 如果有 this，那么这里的 this 可能并不是你期待的！
     }
   }
   ```

取消了 `this`，取而代之的是 `setup` 增加了2个参数：

- props，组件参数
- context，上下文信息

```
setup(props, context) {
    // props
    // context.attrs
    // context.slots
    // context.emit
}
```

也许你会有疑问，仅有这2个参数就够了么？够了。你在 Vue2.x 的时候，`this` 无法就是获取一些 data、props、computed、methods 等么？

其实，这2个参数都是外部引入的，这个没办法只能带入初始化函数中。除此之外，你组件上用到的所有 this 能获取的数据，现在都相当于在 setup 中去定义了，相当于局部变量一样，你还要 this 干嘛呢？

比如：

```
setup(props, context) {
    // data
    const count = ref(1)
    
    // 生命周期钩子函数
    onMounted(() => {
      console.log('mounted!')
    })
    
    // 计算函数
    const plusOne = computed(() => count.value + 1)
    
    // methods 方法
    const testMethod = () => {
        console.log('methods');
    }
    
    // return to template
    return {
        count,
        testMethod
    }
}
```

一切在 `setup` 中，都相当于变成了 `局部变量` 了，你还要 `this` 干嘛？

当然，如果你要讲 Vue2.x 和 Vue3.x 混用！那就很别扭了，以后用 this，以后又不能用，你自己也会懵逼，所以在此建议：**虽然Vue3.x兼容Vue2.x语法，但是不建议混合使用各自语法！**

### **5.2 reactive 方法**

被 `reactive` 方法包裹后的 `对象` 就变成了一个代理对象，相当于 Vue2.x 中的 `Vue.observable()`。也就可以实现页面和数据之间的双向绑定了。

这个包裹的方法是 `deep` 的，对所有嵌套的属性都生效。

**注意：** 一般约定 `reactive` 的参数是一个对象，而下文提到的 `ref` 的参数是一个基本元素。但如果反过来也是可以的，`reactive` 其实可以是任意值，比如：`reactive(123)` 也是可以变成一个代理元素，可以实现双向绑定。

比如：

```
<template>
    <div>
        <p>{{ obj1.cnt }}</p>
        <p>{{ obj2.cnt }}</p>
    </div>
</template>

<script>
import { reactive } from 'vue'
setup() {
    // 普通对象
    const obj1 = {
        cnt: 1
    }
    // 代理对象
    const obj2 = reactive({
        cnt: 1
    })
    obj1.cnt++
    obj2.cnt++
    return {
        obj1,
        obj2
    }
}
</script>
```

页面显示结果：

```
1
2
```

可以看到，普通对象属性更新时，页面是不会同步更新的。只有代理对象，才可以实现双向绑定。

### **5.3 ref 方法**

被 `ref` 方法包裹后的 `元素` 就变成了一个代理对象。一般而言，这里的元素参数指 `基本元素` 或者称之为 `inner value`，如：number, string, boolean,null,undefied 等，object 一般不使用 `ref`，而是使用上文的 `reactive`。

也就是说 `ref` 一般适用于某个元素的；而 `reactive` 适用于一个对象。

`ref` 也就相当于把单个元素转换成一个 `reactive` 对象了，对象默认的键值名是：`value`。

比如：

```
setup() {
    const count = ref(100)
}
```

被 `ref` 包裹后的元素变成一个代理对象，效果就相当于：

```
setup() {
    const count = reactive({
        value: 100
    })
}
```

因为变成了一个代理对象，所以取值的时候需要 `.value`：

```
setup() {
    const count = ref(100)
    console.log(count.value) // output: 100
}
```

另外 `ref` 的结果在 `template` 上使用时，会自动打开 `unwrap`，不需要再加 `.value`

```
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    return {
      count: ref(0)
    }
  }
}
</script>
```

以下是一些基本元素 `ref` 的结果：

```
setup() {
    console.log(ref(100).value) // output: 100
    console.log(ref('test').value) // output: test
    console.log(ref(true).value) // output: true
    console.log(ref(null).value) // output: null
    console.log(ref(undefined).value) // output: undefined
    console.log(ref({}).value) // output: {}
}
```

### **5.3 isRef 方法**

判断一个对象是否 `ref` 代理对象。

```
const unwrapped = isRef(foo) ? foo.value : foo
```

### **5.4 toRefs 方法**

将一个 `reactive` 代理对象打平，转换为 `ref` 代理对象，使得对象的属性可以直接在 `template` 上使用。

看看下面的例子你可能就明白它的作用了。

```
<template>
  <p>{{ obj.count }}</p>
  <p>{{ count }}
  <p>{{ value }}
</template>

<script>
export default {
  setup() {
    const obj = reactive({
        count: 0,
        value: 100
    })
    return {
      obj,
      // 如果这里的 obj 来自另一个文件，
      // 这里就可以不用包裹一层 key，可以将 obj 的元素直接平铺到这里
      // template 中可以直接获取属性
      ...toRefs(obj)
    }
  }
}
</script>
```

### **5.5computed 函数**

与 Vue2.x 中的作用类似，获取一个计算结果。当然功能有所增强，不仅支持取值 `get`（默认），还支持赋值 `set`。

**注意：** 结果是一个 `ref` 代理对象，js中取值需要 `.value`。

正常获取一个计算结果：

```
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 报错，因为未实现 set 函数，无法赋值操作！
```

当 computed 参数使用 object 对象书写时，使用 get 和 set 属性。set 属性可以将这个对象编程一个可写的对象。

也就是说 `computed` 不仅可以获取一个计算结果，它还可以反过来处理 `ref` 或者 `reactive` 对象！

```
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 100,
  set: val => { count.value = val - 1 }
})

plusOne.value = 1
console.log(count.value) // 0
console.log(plusOne.value) // 100
```

`plusOne.value = 1` 相当于给计算对象赋值，会触发 `set` 函数，于是 `count` 值被修改了。

### ** **

### **5.5 readonly 函数**

使用 `readonly` 函数，可以把 `普通 object 对象`、`reactive 对象`、`ref 对象` 返回一个只读对象。

返回的 readonly 对象，一旦修改就会在 console 有 warning 警告。程序还是会照常运行，不会报错。

```
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 只要有数据变化，这个函数都会执行
  console.log(copy.count)
})

// 这里会触发 watchEffect
original.count++

// 这里不会触发上方的 watchEffect，因为是 readonly。
copy.count++ // warning!
```

## vue特性方便以后项目重构

## Vue 3.0 Composition-API基本特性体验

### setup函数

`setup()` 函数是 vue3 中专门为组件提供的新属性，相当于2.x版本中的`created`函数,之前版本的组件逻辑选项，现在都统一放在这个函数中处理。它为我们使用 vue3 的 `Composition API` 新特性提供了统一的入口,**setup** 函数会在相对于2.x来说，会在 **beforeCreate** 之后、**created** 之前执行！具体可以参考如下：

| vue2.x           | vue3            |
| ---------------- | --------------- |
| ~~beforeCreate~~ | setup(替代)     |
| ~~created~~      | setup(替代)     |
| beforeMount      | onBeforeMount   |
| mounted          | onMounted       |
| beforeUpdate     | onBeforeUpdate  |
| updated          | onUpdated       |
| beforeDestroy    | onBeforeUnmount |
| destroyed        | onUnmounted     |
| errorCaptured    | onErrorCaptured |

### 新钩子

除了2.x生命周期等效项之外，Composition API还提供了以下debug hooks：

- `onRenderTracked`
- `onRenderTriggered`

两个钩子都收到`DebuggerEvent`类似于`onTrack`和`onTrigger`观察者的选项：

```
export default {
  onRenderTriggered(e) {
    debugger
    // inspect which dependency is causing the component to re-render
  }
}
```

### 依赖注入

`provide`和`inject`启用类似于2.x `provide/inject`选项的依赖项注入。两者都只能在`setup()`当前活动实例期间调用。

```
import { provide, inject } from '@vue/composition-api'

const ThemeSymbol = Symbol()

const Ancestor = {
  setup() {
    provide(ThemeSymbol, 'dark')
  }
}

const Descendent = {
  setup() {
    const theme = inject(ThemeSymbol, 'light' /* optional default value */)
    return {
      theme
    }
  }
}
```

`inject`接受可选的默认值作为第二个参数。如果未提供默认值，并且在Provide上下文中找不到该属性，则`inject`返回`undefined`。

**注入响应式数据**

为了保持提供的值和注入的值之间的响应式，可以使用`ref`

```
// 在父组建中
const themeRef = ref('dark')
provide(ThemeSymbol, themeRef)

// 组件中
const theme = inject(ThemeSymbol, ref('light'))
watchEffect(() => {
  console.log(`theme set to: ${theme.value}`)
})
```

1. 因为`setup`函数接收2个形参，第一个是`initProps`，即父组建传送过来的值！，第二个形参是一个**上下文对象**

`setupContext`，这个对象的主要属性有 ：

```
attrs: Object    // 等同 vue 2.x中的 this.$attrs
emit: ƒ ()       // 等同 this.$emit()
isServer: false   // 是否是服务端渲染
listeners: Object   // 等同 vue2.x中的this.$listeners
parent: VueComponent  // 等同 vue2.x中的this.$parent
refs: Object  // 等同 vue2.x中的this.$refs
root: Vue  // 这个root是我们在main.js中，使用newVue()的时候，返回的全局唯一的实例对象，注意别和单文件组建中的this混淆了
slots: {}   // 等同 vue2.x中的this.$slots
ssrContext:{}	// 服务端渲染相关
```

⚠️**注意**：在 `setup()` 函数中无法访问到 `this`的，不管这个`this`指的是全局的的vue对象(即：在main.js 中使用new生成的那个全局的vue实例对象)，还是指单文件组建的对象。

但是，如果我们想要访问当前组件的实例对象，那该怎么办呢？我们可以引入`getCurrentInstance`这个api,返回值就是当前组建的实例！

```
import { computed, getCurrentInstance } from "@vue/composition-api";
export default {
  name: "svg-icon",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  setup(initProps,setupContext) { 
  
    const { ctx } = getCurrentInstance();
    const iconName = computed(() => {
      return `#icon-${initProps.iconClass}`;
    });
    const svgClass = computed(() => {
      if (initProps.className) {
        return "svg-icon " + initProps.className;
      } else {
        return "svg-icon";
      }
    });
    return {
      iconName,
      svgClass
    };
  }
};
</script>
```

### Ref自动展开（unwrap）

`ref()` 函数用来根据给定的值创建一个**响应式**的**数据对象**，`ref()` 函数调用的返回值是一个被包装后的对象（RefImpl），这个对象上只有一个 `.value` 属性，如果我们在`setup`函数中，想要访问的对象的值，可以通过`.value`来获取，但是如果是在`<template>`**模版中**，直接访问即可，不需要`.value`！

```
import { ref } from '@vue/composition-api'

setup() {
    const active = ref("");
    const timeData = ref(36000000);
    console.log('输出===>',timeData.value)
    return {
       active,
       timeData
    }
}
<template>
  <p>活动状态：{{active}}</p>
  <p>活动时间：{{timeData}}</p>
</template>
```

⚠️注意：不要将`Array`放入`ref`中，数组索引属性无法进行自动展开，也**不要**使用 `Array` 直接存取 `ref` 对象:

```
const state = reactive({
  list: [ref(0)],
});
// 不会自动展开, 须使用 `.value`
state.list[0].value === 0; // true

state.list.push(ref(1));
// 不会自动展开, 须使用 `.value`
state.list[1].value === 1; // true
```

当我们需要操作DOM的时候，比如我们在项目中使用`swiper`需要获取DOM,那么我们还可以这样👇！

```
  <div class="swiper-cls">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(img ,index) in tabImgs.value" :key="index">
          <img class="slide_img" @click="handleClick(img.linkUrl)" :src="img.imgUrl" />
        </swiper-slide>
      </swiper>
   </div>
```

然后在`setup`函数中定义一个`const mySwiper = ref(null);`，之前在vue2.x中，我们是通过`this.$refs.mySwiper`来获取DOM对象的，现在也可以使用`ref`函数代替，返回的`mySwiper`要和`template`中绑定的`ref`相同！

```
import { ref, onMounted } from "@vue/composition-api";
setup(props, { attrs, slots, parent, root, emit, refs }) {
	const mySwiper = ref(null);
  onMounted(() => {
    // 通过mySwiper.value 即可获取到DOM对象！
    // 同时也可以使用vue2.x中的refs.mySwiper ，他其实mySwiper.value 是同一个DOM对象！
    mySwiper.value.swiper.slideTo(3, 1000, false);
  });
  return {
    mySwiper
  }
}
```

### reactive

`reactive()` 函数接收一个普通对象，返回一个响应式的数据对象，等价于 `vue 2.x` 中的 `Vue.observable()` 函数，`vue 3.x` 中提供了 `reactive()` 函数，用来创建响应式的数据对象`Observer`，`ref`中我们一般存放的是**基本类型数据**，如果是引用类型的我们可以使用`reactive`函数。

当`reactive`函数中，接收的类型是一个`Array`数组的时候，我们可以在这个`Array`外面在用对象包裹一层，然后给对象添加一个属性比如：`value`（这个属性名你可以自己随便叫什么），他的值就是这个数组！

```
<script>
// 使用相关aip之前必须先引入
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "home",
  setup(props, { attrs, slots, parent, root, emit, refs }) {
    
    const active = ref("");
    const timeData = ref(36000000);
    // 将tabImgs数组中每个对象都变成响应式的对象 
    const tabImgs = reactive({
      value: []
    });
    const ball = reactive({
      show: false,
      el: ""
    });
    return {
      active,
      timeData,
      tabImgs,
      ...toRefs(ball),
    };
  }
};
</script>
```

那么在`template`模版中我们想要访问这个数组的时候就是需要使用`.value`的形式来获取这个数组的值。

```
<template>
    <div class="swiper-cls">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(img ,index) in tabImgs.value" :key="index">
          <img class="slide_img" @click="handleClick(img.linkUrl)" :src="img.imgUrl" />
        </swiper-slide>
      </swiper>
    </div>
</template>
```

### isRef

`isRef()` 用来判断某个值是否为 `ref()` 创建出来的对象；当需要展开某个可能为 `ref()` 创建出来的值的时候，可以使用`isRef`来判断！

```
import { isRef } from '@vue/composition-api'

setup(){
  const headerActive = ref(false);
  // 在setup函数中，如果是响应式的对象，在访问属性的时候，一定要加上.value来访问！
  const unwrapped = isRef(headerActive) ? headerActive.value : headerActive
  return {}
}
```

### toRefs

`toRefs`函数会将**响应式对象**转换为**普通对象**，其中返回的对象上的每个属性都是指向原始对象中相应属性的`ref`，将一个对象上的所有属性转换成响应式的时候，将会非常有用！

```
import { reactive,toRefs } from '@vue/composition-api'
setup(){
  // ball 是一个 Observer
  const ball = reactive({
    show: false,
    el: ""
  });
  // ballToRefs 就是一个普通的Object，但是ballToRefs里面的所有属性都是响应式的（RefImpl）
  const ballToRefs  = toRefs(ball)
  // ref和原始属性是“链接的”
  ball.show = true
  console.log(ballToRefs.show) // true
  ballToRefs.show.value = false
  console.log(ballToRefs.show) // false
  return {
    ...ballToRefs    // 将ballToRefs对象展开，我们就可以直接在template模板中直接这样使用这个对象上的所有属性！
  }
}
```

点击添加按钮，小球飞入购物车动画：

```
<template>  
  <div class="ballWrap">
      <transition @before-enter="beforeEnter" @enter="enter" @afterEnter="afterEnter">
        <!-- 可以直接使用show-->
        <div class="ball" v-if="show">
          <li class="inner">
            <span class="cubeic-add" @click="addToCart($event,item)">
              <svg-icon class="add-icon" icon-class="add"></svg-icon>
            </span>
          </li>
        </div>
      </transition>
   </div>
</template>
```

### computed

`computed`函数的第一个参数，可以接收一个函数，或者是一个对象！如果是函数默认是`getter`函数，并为`getter`返回的值返回一个只读的`ref`对象。

```
import { computed } from '@vue/composition-api'

const count = ref(1)
// computed接收一个函数作为入参
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误，plusOne是只读的！
```

或者也可以是个对象，可以使用具有`get`和`set`功能的对象来创建可写`ref`对象。

```
const count = ref(1)
// computed接收一个对象作为入参
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

### watch

```
watch(source, cb, options?)
```

该`watch`API与2.x `this.$watch`（以及相应的`watch`选项）完全等效。

#### 观察单一来源

观察者数据源可以是返回值的getter函数，也可以直接是ref：

```
// watching a getter函数
const state = reactive({ count: 0 })
watch(
  () => state.count, // 返回值的getter函数
  (count, prevCount,onCleanup) => {
    /* ... */
  }
)

// directly watching a ref
const count = ref(0)
watch(
  count, // 也可以直接是ref
  (count, prevCount,onCleanup) => {
  /* ... */
})
```

#### watch多个来源

观察者还可以使用数组同时监视多个源：

```
const me = reactive({ age: 24, name: 'gk' })
// reactive类型的
watch(
  [() => me.age, () => me.name], // 监听reactive多个数据源，可以传入一个数组类型，返回getter函数
  ([age, name], [oldAge, oldName]) => {
    console.log(age) // 新的 age 值
    console.log(name) // 新的 name 值
    console.log(oldAge) // 旧的 age 值
    console.log(oldName) // 新的 name 值
  },
  // options
  {
    lazy: true //默认 在 watch 被创建的时候执行回调函数中的代码，如果lazy为true ，怎创建的时候，不执行！
  }
)

setInterval(() => {
  me.age++
  me.name = 'oldMe'
}, 7000000)

// ref类型的
const work = ref('web')
const addres = ref('sz')
watch(
  [work,address],  // 监听多个ref数据源
  ([work, addres], [oldwork, oldaddres]) => {
   //......
  },
  {
    lazy: true 
  }
)
```

`watch`和组件的生命周期绑定，当组件卸载后，watch也将自动停止。在其他情况下，它返回停止句柄，可以调用该句柄以显式停止观察程序：

```
// watch 返回一个函数句柄，我们可以决定该watch的停止和开始！
const stopWatch = watch(
  [work,address],  // 监听多个ref数据源
  ([work, addres], [oldwork, oldaddres]) => {
   //......
  },
  {
    lazy: true 
  }
)

// 调用停止函数，清除对work和address的监视
stopWatch()
```

#### 在 watch 中清除无效的异步任务

```
<div class="search-con">
  <svg-icon class="search-icon" icon-class="search"></svg-icon>
  <input v-focus placeholder="搜索、关键词" v-model="searchText" />
</div>
setup(props, { attrs, slots, parent, root, emit, refs }){
  const CancelToken = root.$http.CancelToken 
  const source = CancelToken.source() 
  // 定义响应式数据 searchText
  const searchText = ref('')

  // 向后台发送异步请求
  const getSearchResult = searchText => {
   root.$http.post("http://test.happymmall.com/search",{text:searchText}, {
     cancelToken: source.token
   }).then(res => {
    // .....
   });
  return source.cancel
}

// 定义 watch 监听
watch(
  searchText,
  (searchText, oldSearchText, onCleanup) => {
    // 发送axios请求，并得到取消axios请求的 cancel函数
    const cancel = getSearchResult(searchText)

    // 若 watch 监听被重复执行了，则会先清除上次未完成的异步请求
    onCleanup(cancel)
  },
  // watch 刚被创建的时候不执行
  { lazy: true }
)

  return {
    searchText
  }
}
```

## 结束：

vue3新增 Composition API。新的 API 兼容 Vue2.x，只需要在项目中单独引入 @vue/composition-api 这个包就能够解决我们目前 Vue2.x中存在的个别难题。比如：如何组织逻辑，以及如何在多个组件之间抽取和复用逻辑。基于 Vue 2.x 目前的 API 我们有一些常见的逻辑复用模式，但都或多或少存在一些问题：

这些模式包括：

1. Mixins
2. 高阶组件 (Higher-order Components, aka HOCs)
3. Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件）

总体来说，以上这些模式存在以下问题：

1. 模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 mixin 的时候，光看模版会很难分清一个属性到底是来自哪一个 mixin。HOC 也有类似的问题。
2. 命名空间冲突。由不同开发者开发的 mixin 无法保证不会正好用到一样的属性或是方法名。HOC 在注入的 props 中也存在类似问题。
3. 性能。HOC 和 Renderless Components 都需要额外的组件实例嵌套来封装逻辑，导致无谓的性能开销。

vue3中，新增 `Composition API`。而且新的`API`兼容 `Vue2.x`，只需要在项目中，单独引入 `@vue/composition-api` 这个包就可以，就能够解决我们目前 以上大部分问题。同时，如果我直接升级到 `Vue3.x`，我要做的事情会更多，只要当前项目中使用到的第三方ui库，都需要重新改造，以及升级后的诸多坑要填！刚开始的时候，我就是直接在当前脚手架的基础上 `vue add vue-next` 安装升级，但是只要是有依赖第三方生态库的地方，就有许多的坑。。。

`Vue3.x` 没有导出默认对象 `export default`，在第三方生态中，常用`Vue.xxx()`来进行依赖，现在这些语法需要重写，工作量可不小啊！

如果是新团队、小型的项目，可以尝试使用vue3进行尝试开发，慢慢过度，当 `Vue3.x` 正式 发布 后，而且周边生态跟上来了，就可以直接用vue3了！

在[bilibili](https://search.bilibili.com/all?keyword=VUE3.0&from_source=nav_search&spm_id_from=333.851.b_696e7465726e6174696f6e616c486561646572.10)直播的时候，Evan You也说了，目前vue3 beta版本，最重要的是**提升稳定性**，和对**第三方工具库的支持**，如果你是第三方库的作者，可以现在开始，熟悉熟悉源码了，我们开发者可以先读懂所有API的使用。