---
title: vue -- computed的原理是什么
date: 2019-02-20
tags:
 - Vue
categories:
 -  Vue
---

[vue官方文档](https://cn.vuejs.org/v2/guide/computed.html)

## computed的原理

要讲清楚，computed原理，首先得讲vue响应式原理，因为computed的实现是基于Watcher对象的。 那么vue的响应式原理是什么呢，众所周知，vue是基于Object.defineProperty实现监听的。在vue初始化数据data和computed数据过程中。会涉及到以下几个对象：

1. Observe对象

2. Dep对象

3. Watch对象

   Observe对象是在data执行响应式时候调用，因为computed属性基于响应式属性，所以其不需要创建Observe对象。 Dep对象主要功能是做依赖收集，有个属性维护多个Watch对象，当更新时候循环调用每个Watch执行更新。 Watch对象主要是用于更新，而且是收集的重点对象。

这里谈到computed计算属性，首先要知道，其有两种定义方式，一种是方法，另一种是get，set属性。而且，其内部监听的对象必须是已经定义响应式的属性，比如data的属性vuex的属性。

vue在创建computed属性时候，会循环所有计算属性，每一个计算属性会创建一个watch，并且在通过defineProperty定义监听，在get中，计算属性工作是做依赖收集，在set中，计算属性重要工作是重新执行计算方法，这里需要多补充一句，因为computed是懒执行，也就是说第一次初始化之后，变不会执行计算，下一次变更执行重新计算是在set中。

另一个补充点是依赖收集的时机，computed收集时机和data一样，是在组件挂载前，但是其收集对象是自己属性对应的watch，而data本身所有数据对应一个watch。

以下附计算属性源码验证说法：

```
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

可以看到，在执行new Watcher之前，会对计算属性做判断，判断其是否为函数，如果不是则取getter。这是因为计算属性有两种定义方式。之后第二步是执行deineCoumputed。这一步只是简单的调用defineProterty我就不贴代码了。

关于计算属性的getter和setter定义如下： 重点关注get的懒加载部分，和Watcher的定义

```
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}
```

## computed的机制

computed的计算属性有缓存机制，只有当其依赖的响应式数据发生变化时才会清空缓存重新计算结果

1. 其缓存机制本质是通过一个dirty属性控制的，只有dirty为true时才会重新计算结果替换缓存。
2. dirty只有当其响应式数据发送变化时才会设置为true，重新计算后会再次被设置为false

```
<template>
	<div>
		<button @click="changeValue">更新Value</button>
		<button @click="getComputedValue">打印computedValue</button>
	</div>
</template>
<script>
export default {
	data(){
		return {
			value: 1
		}
	},
	computed: {
		computedValue(){
			return this.value + '--' + Math.random()
		}
	},
	methods: {
		changeValue(){
			this.value++;
		},
		getComputedValue(){
			console.log(this.computedValue);
		}
	}
}
</script>
```

1. 点击第二个按钮，多次获取computedValue的值时，返回的值都是相同的，Math.random()不会重新获取。体现了computed的缓存特性。
2. 只有当点击了第一个按钮，修改了computedValue依赖的响应式数据后，才会更新computedValue的缓存