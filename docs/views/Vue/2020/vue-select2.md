---
title: vue组件之select2调用
date: 2018-04-20
tags:
 - Vue
categories:
 -  Vue
---

## select下拉搜索选择

```
<!DOCTYPE html>
<html>

<head>
    <title>vue select2 封装</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
    <style type="text/css">
        .content {
            text-align: center;
            padding: 50px;
        }

        .content * {
            text-align: left;
        }

        .select {
            width: 350px;
        }
    </style>
</head>

<body>
    <div class="content" id="vue-example">
        <select class="select" v-select2='options' v-model="selectValue"></select>
        <br />
        <span>结果：{{ selectValue }}</span>
    </div>
</body>
<script type="text/javascript">
    Vue.directive('select2', {
        inserted: function (el, binding, vnode) {
            let options = binding.value || {};

            $(el).select2(options).on("select2:select", (e) => {
                // v-model looks for
                //  - an event named "change"
                //  - a value with property path "$event.target.value"
                el.dispatchEvent(new Event('change', { target: e.target })); //说好的双向绑定，竟然不安套路
            });
        },
        update: function (el, binding, vnode) {
            $(el).trigger("change");
        }
    });

    var vueApp = new Vue({
        el: "#vue-example",
        data: {
            selectValue: '你还没有选值',
            options: {
                data: [
                    { id: 0, text: 'enhancement' },
                    { id: 1, text: 'bug' },
                    { id: 2, text: 'duplicate' },
                    { id: 3, text: 'invalid' },
                    { id: 4, text: 'wontfix' }
                ]
            }
        }
    });
</script>

</html>
```

## select下拉搜索代码调整

对代码进行了调整，当然，也是操作了dom，但是由于封装在指令里面了，使用人员不需要再次操作，不涉及到开发人员操作dom的情况

```
Vue.directive('select2', {
    inserted: function (el, binding, vnode) {
        let options = binding.value || {};

        $(el).select2(options).on("select2:select", (e) => {
            // v-model looks for
            //  - an event named "change"
            //  - a value with property path "$event.target.value"
            el.dispatchEvent(new Event('change', { target: e.target })); //说好的双向绑定，竟然不安套路
            console.log("fire change in insert");
        });
    },
    update: function (el, binding, vnode) {
        for (var i = 0; i < vnode.data.directives.length; i++) {
            if (vnode.data.directives[i].name == "model") {
                $(el).val(vnode.data.directives[i].value);
                console.log("new value in update:"+vnode.data.directives[i].value);
            }
        }
        $(el).trigger("change");
        console.log("fire change in update");
    }
});

//html代码

<select v-select2="" v-model="editor.P1" required="required" class="form-control ">
<option value=""></option>
<option v-for="item in codes" v-bind:value="item.NAME">{{item.NAME}}</option>
</select>
```

原来的代码的update中，加入修改`el`的val值，然后再触发`select2`的`change`事件，就可以了。而在使用方面，只需要给加一个v-select2即可，v-model以及option的配置都依照vue2的推荐方式，原封不动。之所以加了一个空的`option`是因为如果不加，默认`select2`是选择第一个选项的，但是，由于未知原因，与vue.editor.P1并不同步。

vue.editor.P1不同步问题需要通过异步ajax请求更新数据后会进行同步操作。