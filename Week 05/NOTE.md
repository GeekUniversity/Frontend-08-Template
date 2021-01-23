# 学习笔记：proxy

## proxy的基本用法

不太建议大家在业务中广泛使用proxy

它的设计强大且危险，应用了proxy的一些代码，预期性会变差，所以说其实proxy这个特性是專門为底层库来去设计的这样一个特性

这节课先认识proxy的基本用法，后面还会实现一下Vue3.0的reactive的这样的一个模型，那么我们并不是实际的生产代码，我们会给大家去把这个，写一个玩具版本的reactive，给大家去学习一下，proxy有哪些强大的用途，那么我们首先了解一下proxy的基本用法

```js
// 这是object它其实是一个，如果我们去访问它的a属性和b属性，这个中间，它其实是写死的，我们没有办法在这个中间加入任何监听的代码。这样的话，这个object其实是一个不可observe的这样的一个对象，它就是一个单纯的数据存储，这也是javascript最底层的机制，我们是没有办法改变的。
let object = {
    a: 1,
    b: 2
}

// 我们如果有一个对象，既想要让它设置起来，像一个普通对象一样，又想让他能够被监听，那么我们怎么办？我们就可以通过proxy把object做一层包裹，那么我们接下来就创建一个proxy。
// 先传object，再传config（包含所有要对object做的钩子）
let po = new Proxy(object, {
    // 设置对象属性时就会触发set函数
    set(obj, prop, val) {
        console.log(obj, prop, val)
    }
})

po.a = 3
// {a: 1, b: 2} "a" 3

// Proxy详细： https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

// Proxy是一种特殊对象，上面所有的行为都是可以被重新再去指定的
```

## 模仿reactive实现原理

```js
let object = {
    a: 1,
    b: 2
}

let callbacks = new Map()

let usedReactivities = []

let po = reactive(object)

effect(() => {
    console.log(po.a)
})

function effect(callback) {
    //callbacks.push(callback)
    // 清除usedReactivities
    usedReactivities = []
    // 执行callback
    callback()
    console.log(usedReactivities)

    for (let reactivity of usedReactivities) {
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map())
        } 
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], [])
        }
        // 将callback加入到所有的reactivity
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
    }
}

function reactive(object) {
    return new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val
            if (callbacks.get(obj))
                if (callbacks.get(obj).get(prop))
                    for (let callback of callbacks.get(obj).get(prop)) {
                        callback()
                    }
            return obj[prop]
        },
        get(obj, prop) {
            // 把得到的属性记录到usedReactivities
            usedReactivities.push([obj, prop])
            return obj[prop]
        }
    })
}
```

### 优化reactive

```js
let object = {
    a: 1,
    b: 2
}

let callbacks = new Map()

// 缓存
let reactivities = new Map()

let usedReactivities = []

let po = reactive(object)

effect(() => {
    console.log(po.a.b)
})

function effect(callback) {
    //callbacks.push(callback)
    // 清除usedReactivities
    usedReactivities = []
    // 执行callback
    callback()
    console.log(usedReactivities)

    for (let reactivity of usedReactivities) {
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map())
        } 
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], [])
        }
        // 将callback加入到所有的reactivity
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
    }
}

function reactive(object) {
    if (reactivities.has(object)) {
        return reactivities.get(object)
    }
    let proxy = new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val
            if (callbacks.get(obj))
                if (callbacks.get(obj).get(prop))
                    for (let callback of callbacks.get(obj).get(prop)) {
                        callback()
                    }
            return obj[prop]
        },
        get(obj, prop) {
            // 把得到的属性记录到usedReactivities
            usedReactivities.push([obj, prop])

            if(typeof obj[prop] === "object") {
                return reactive(obj[prop])
            }

            return obj[prop]
        }
    })

    reactivities.set(object, proxy)

    return proxy
}
```

完整的reactive的库怎么写，可以参考Vue的源代码（代码量是这个的几倍不止），所以讲原理和实际代码还是有区别的