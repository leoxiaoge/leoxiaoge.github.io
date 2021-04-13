---
title: react--调用setState方法时到底发生了什么
date: 2019-02-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

### 概述

setState是React中最重要的API之一，可是当我们调用setState的时候到底发生了什么呢？setState到底是同步改变状态，还是异步改变状态的呢？本文将从源码层面上来剖析setState的执行流程，通过逐步调试来搞清楚，setState到底做了一些什么事情。

### 调试准备

为了理解setState的执行过程，我们需要一个计数器的组件，相信看过各种React教程的demo的我们对这个组件应该很熟悉。

```
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    debugger;
    this.setState({
      value: this.state.value + 1
    });
  }

  render() {
    return (
      <div className="App">
        <p>
          <span>{this.state.value}</span>
        </p>
        <button onClick={this.handleClick}>Click me!</button>
      </div>
    );
  }
}

export default App;
```

构造方法中初始化了状态对象，里面有一个value属性，然后绑定了handleClick到当前对象。

handleClick方法中调用了this.setState()方法来更新value。

render方法中根据当前的value渲染点击次数，此外添加一个按钮，并绑定事件，使当点击该按钮时执行handleClick方法。

组件的实现很简单，但我们需要的东西已经基本都有了，然后我们把它挂载到某个DOM的某个节点（作为APP的根节点）下即可。

```
// ...
ReactDOM.render(<App />, document.getElementById('root'));
// ...
```

为了方便调试，我们在handleClick方法中添加了一行debugger。

### 开始调试

首先打开网页，打开开发者工具，然后点击计数器按钮，这是代码就会在断点处停住。

```
// ...
handleClick(e) {
  debugger; // <-- 这里是断点，我们从这里开始往下调试。
  this.setState({
    value: this.state.value + 1
  });
}
// ...
```

接着继续往下走。

```
// ...
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState); // <-- 这里，我们继续深入下去
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
// ...
```

在ReactComponent.prototype.setState方法中，这个函数内一共三句代码：

1. 验证参数类型；
2. 执行this.updater.enqueueSetState(this, partialState);
3. 如果有callback，则执行this.updater.enqueueCallback(this, callback, ‘setState’);

不难发现，第2行代码才是我们关注的重点，虽然为了方便setState执行状态更新之后的回调逻辑，React引入了setState的callback参数，但callback的处理其实和state的处理很类似，所以我们先来看state的更新是如何实现的。

执行到第二行代码之后，继续往下执行。

```
// ...
enqueueSetState: function (publicInstance, partialState) {
  if (process.env.NODE_ENV !== 'production') {
    ReactInstrumentation.debugTool.onSetState();
    process.env.NODE_ENV !== 'production' ? warning(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().') : void 0;
  }

  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState'); // 获取React的内部实例

  if (!internalInstance) {
    return;
  }

  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);  // 获取内部实例的_pendingStateQueue
  queue.push(partialState);

  enqueueUpdate(internalInstance); // <-- 在这里继续深入调试
},
// ...
```

一开始的那一长串又是参数验证，我们直接跳过，然后有一行internalInstance的代码，实际上，React在内存中为每一个组件实例都保存了一个内部实例，内部实例有会临时保存我们对实例的一些变动，比如现在我们正在看的状态的改变，就会在内部实例的某些属性中保存起来。

queue那行代码获取了内部实例用于处理状态更新的一个关键数组，_pendingStateQueue（如果不存在，则赋值一个新的空的数组），然后将新的状态推进数组queue中。

函数的最后，调用了euqueueUpdate(internalInstance)方法。

```
// ...
function enqueueUpdate(internalInstance) {
  ReactUpdates.enqueueUpdate(internalInstance); // <-- 秘密还在更里面
}
// ...
```

继续执行enqueueUpdate函数，它接收了内部实例作为参数，注意我们已经把新的状态放到了内部实例的_pendingStateQueue中去了，现在的内部实例有我们想要更新的全部信息。

到目前为止，我们还是没有看到setState到底哪里更新了状态，而enqueueUpdate函数中只有一行代码，毋庸置疑，秘密肯定就在这里，为了一探究竟，我们继续往深处调试。（别急，我们快到底了）。

```
function enqueueUpdate(component) {
  ensureInjected();

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

enqueueUpdate是中的第一句确保了React有一个更新策略，这一行也只是在做验证，不是我们关注的重点。

React目前只有一个ReactDefaultBatchingStrategy更新策略，猜想React的这个更新策略模式可能是为了以后方便扩展而设计的。

如果当前策略不处于更新状态的话（batchingStrategy.isBatchingUpdates === false），则进行更新的相关处理并且返回，但很明显，我们现在就处于更新状态（毕竟我们就在更新一个组件嘛，不过我们后面还会分析为什么现在处于更新状态），因此我们会执行setState方法中最关键的一条语句：

```
// ...
dirtyComponents.push(component);
// ...
```

dirtyComponents是一个用于存储**『脏组件』**的数组，所谓的脏组件，就是组件的一些属性发生了变动，但是还没有将新属性更新到视图的组件。

最后记录一下当前待更新组件的updateBatchNumber（为了防止一个组件被更新多次而设置的一个ID，感兴趣的同学可以去看下源码的注释，这里不是我们的重点，重点是dirtyComponents）。

然后呢？好像所有的代码都分析完了，后面也没有代码可调试了，不信我们可以试试，会发现调试确实随着我们刚刚看到的调用栈又一步一步走了出来。

好了，到这一步，setState方法已经完成了所有的工作，我们简单总结一下它做了什么。

**根据当前组件实例获取React管理的内部实例，将新的状态放到_pendingStateQueue中，如果当前React更新组件的策略不处于更新状态，则执行策略的batchedUpdates方法，否则将当前内部实例放到一个dirtyComponents的数组中。**

以上就是setState做的核心工作（不含对callback的处理，对callback的处理类似，也是临时存储，也是将内部实例放到dirtyComponents中）。

那么问题来了，我们有没有看到状态更新呢？并没有，状态依然没有更新，**setState并没有直接更新组件的状态**。

为了进一步弄明白React是如何更新状态的，在我们完全调试完setState之后，我们还需要继续往上调试，搞清楚了setState做的这些工作还不够，我们还要看看，到底是谁调用handleClick？

为什么要去看handleClick呢？因为我们目前确定的信息是，**setState没有更新状态，但handleClick的整个事件处理过程中肯定是在某一步更新了状态。**虽然不确定到底React是在哪一步更新的状态，但是从handleClick开始考虑，肯定是不会有错的。

### 事件、ReactDefaultBatchingStrategy、状态更新

handleClick到底是在哪里处理的呢？有同学会说，当然是点击事件处理的handleClick。

事件的处理不是本文的重点，但是我们还是需要了解一点基础，实际上React并不会将真正的DOM事件挂载到具体的节点上，而是直接在根节点上挂载一个事件处理器，然后通过事件委托的方式去处理具体的节点。

所以当我们点击一个组件的时候，事件的真正处理者是根节点，当点击事件。

为了搞清楚状态的更改到底发生在哪里，我们需要来看一下handleClick的调用栈。

上面的调用栈是从点击事件开始一直到handleClick的调用栈，我们从下往上看，会发现有一个ReactDefaultBatchingStrategy的文件（从下往上看第3个文件），里面调用了batchedUpdates这个方法，这个方法实际上在上面出现过，在哪里呢？就在dirtyComponents添加内部实例这句话的上面。

```
if (!batchingStrategy.isBatchingUpdates) {
  batchingStrategy.batchedUpdates(enqueueUpdate, component); // <-- 这里
  return;
}
dirtyComponents.push(component);
```

之前说过batchingStrategy其实就是事件ReactDefaultBatchingStrategy，现在来看看这个里面的代码是什么。

```
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,
  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    ReactDefaultBatchingStrategy.isBatchingUpdates = true; // <-- 设置当前更新状态为真
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e); // <-- 调用栈入口
    }
  }
};
```

在batchedUpdates中，isBatchingUpdates被设置为真，而之前判断的isBatchingUpdates和这个是同一个属性，此外还有一行关键的代码，transaction.perform(callback, null, a, b, c, d, e)。

如果看过[参考1](https://oychao.github.io/2017/09/25/react/16_transaction/)或者对React底层比较熟悉，这行代码应该很眼熟，这就是我们在前面的文章中有详细讲过的React中的Transaction。进一步调试会发现，事务中执行目标函数的时候依然没有更新状态，然而当调试到执行closeAll时，状态终于更新了。

为了搞清楚整个过程，我们先回顾一下React的事务。

```
/**
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 */
```

上面的注释就是React事务的原理图，具体到状态更新的事务时，处理handleClick和setState就在最中间的anyMethod那里被执行，但是状态的更新却是在某个wrapper的close时被执行。

这就是为什么setState之后无法立刻获取到最新的状态的原因了，因为最新的状态一直到事务的目标函数执行结束，都只存在_pendingStateQueue中，直到某个wrapper执行close时才真正被更新。

整个更新实际上从一开始就处于一个大的事务中，这个事务就是ReactDefaultBatchingStrategyTransaction，它在ReactDefaultBatchingStrategy.js文件中被声明。

```
'use strict';

var _assign = require('object-assign');

var ReactUpdates = require('./ReactUpdates');
var Transaction = require('./Transaction');

var emptyFunction = require('fbjs/lib/emptyFunction');

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

_assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  }
});

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;
```

它包含了两个wrapper，分别是RESET_BATCHED_UPDATES和FLUSH_BATCHED_UPDATES，注意FLUSH_BATCHED_UPDATES的close方法，它是ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)，现在来看这个方法在ReactUpdates中的实现。

```
// ...
var flushBatchedUpdates = function () {
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(runBatchedUpdates, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }

    if (asapEnqueued) {
      asapEnqueued = false;
      var queue = asapCallbackQueue;
      asapCallbackQueue = CallbackQueue.getPooled();
      queue.notifyAll();
      CallbackQueue.release(queue);
    }
  }
};
// ...
```

flushBatchedUpdates会检测dirtyComponents的长度，如果有脏组件，它就会对其进行真正的状态更新（还包括执行setState的callback）。

**现在可以总结一下了，当点击一个事件时，React会启动默认的组件更新策略（ReactDefaultBatchingStrategy），该策略有一个事务（ReactDefaultBatchingStrategyTransaction），它绑定的目标函数会层层深入，最终执行handleClick中的setState的方法，然后React管理的内部实例就会保存当前更新的状态。**

**策略事务的目标函数执行完毕之后，事务的closeAll启动，开始执行绑定的wrapper，而其中有一个名FLUSH_BATCHED_UPDATES为wrapper，它的close方法才是真正处理React组件状态更新的地方（其实还包括一些生命周期函数，如果有的话）。**

### 如果不是事件触发的更新呢？

考虑另外一种情况，现在我们是通过点击事件处理触发的状态更新，点击事件发生后，默认的更新策略将更新状态调整为true（ReactDefaultBatchingStrategy.isBatchingUpdates = true），可是如果不是事件触发呢？如果是异步操作中执行的setState呢？来看下面的代码：

```
// ...
constructor(props) {
  super(props);
  this.state = {
    value: 0
  };
  // ...
}
// ...
componentDidMount() {
  setTimeout(() => {
    this.setState({
      value: this.state.value + 1
    });
    console.log(this.state.value);
    this.setState({
      value: this.state.value + 1
    });
    console.log(this.state.value);
  }, 1000);
}
// ...
```

这里在componentDidMount生命周期函数中执行了两个this.setState方法，每次执行this.setState方法之后都输出了this.state.value，那输出结果会是多少呢？在没有深入了解setState，只是听说setState是异步的之前，你可能会说输出的都是0，但实际的运行结果可能会出乎你的意料。

```
// 1
// 2
```

两行代码分别输出1和2，怎么回事，我们上面不是说过，setState只是把新的状态放到_pendingStateQueue中去，然后把对应的内部实例放到dirtyComponents中去吗？注意这个分支有个前提条件，那就是当前更新策略出于更新状态，当我们触发一个点击事件时，如果执行到了handleClick这一步，说明更新策略的更新状态早就已经被设置为true了（ReactDefaultBatchingStrategy.isBatchingUpdates = true），可是当我们异步操作中执行setState呢？更新策略并没有处于更新状态，当前传入setTimeout中的函数是调用栈的顶层函数，这时我们再深入setState调用栈中的enqueueUpdate函数。

```
function enqueueUpdate(component) {
  ensureInjected();

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

注意第一个if语句，这时我们会执行这里面的逻辑，只有一句batchingStrategy.batchedUpdates(enqueueUpdate, component)，然后就return了，所以并不会添加内部实例到脏组件数组中。

那问题就在batchingStrategy.batchedUpdates(enqueueUpdate, component)里面，它到底做了什么呢？

还记得batchedUpdates吗，前面我们有贴过这段代码，但是只看了它所在的对象ReactDefaultBatchingStrategy的isBatchingUpdates，现在我们来看一下batchedUpdates。

```
// ...
batchedUpdates: function (callback, a, b, c, d, e) {
  var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

  ReactDefaultBatchingStrategy.isBatchingUpdates = true;

  // The code is written this way to avoid extra allocations
  if (alreadyBatchingUpdates) {
    return callback(a, b, c, d, e);
  } else {
    return transaction.perform(callback, null, a, b, c, d, e);
  }
}
// ...
```

首先它被传入了enqueueUpdate自身，以及内部实例component。

执行时先获取了默认更新策略，然后把更新状态设置为了true，ReactDefaultBatchingStrategy.isBatchingUpdates = true，然后呢？

注意，又是通过我们上面的讲的那个事务，把enqueueUpdate方法执行了一遍，并且将component也当做参数传了进去（transaction.perform(callback, null, a, b, c, d, e)里面的参数callback就是enqueueUpdate，参数a就是component，这一步不熟悉的同学可以先去看下[参考1](https://oychao.github.io/2017/09/25/react/16_transaction/)）。

到这里我们弄明白了，其实这一步就是发现setState并没有在更新策略中，但却被执行时，激活了一下更新策略，然后在默认更新策略事务（ReactDefaultBatchingStrategyTransaction）中继续执行enqueueUpdate，相当于多做了一步，然后又绕回来继续执行原来的逻辑（内部实例存入脏组件数组）。这么做和之前在事件中执行setState有什么区别呢？区别在于这时管理更新策略的引入是在setState函数内部，而不是执行事件处理的过程中，所以当setState执行全部完成时，整个更新策略事务就结束了，再下一次调用setState时，又得重新启动更新策略事务，所以异步操作（这里是setTimeout）中setState，状态就变成了同步效果了。

### 总结

总结一下，setState执行的关键步骤如下：

1. React的更新策略已经被启动时（事件触发时）：
   React响应事件处理 => 启动更新策略事务（绑定了wrapper） => 事务perform => **setState => 获取内部实例 => 存储新的状态 => 发现更新策略事务已启动 => 将当前内部实例放入脏组件数组 => setState执行结束** => 更新策略事务perform完毕 => *wrapper处理组件状态的更新*
2. React的更新策略没有被启动时（异步触发时）：
   **setState => 获取内部实例 => 存储新的状态 => 发现更新策略事务未启动 => 启动更新策略事务（绑定了wrapper） => 事务perform => 将当前内部实例放入脏组件数组 => 更新策略事务perform完毕 => \*wrapper处理组件状态的更新\* => setState执行结束**

以上就是setState更新状态的过程分析，所以下次如果有人问你，setState是异步还是同步，你千万不要轻易地回答是异步（或者是同步），而应该解释清楚，setState更新状态的过程。