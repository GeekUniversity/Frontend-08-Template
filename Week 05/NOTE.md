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
    a: {b: 1},
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

## reactivity响应式对象——调色盘案例

reactivity负责从数据到DOM元素一条线的监听

```html
<input id="r" type="range" min=0 max=255 />
<input id="g" type="range" min=0 max=255 />
<input id="b" type="range" min=0 max=255 />
<div id="color" style="width: 100px; height:100px">
</div>
<script>
let object = {
    r: 1,
    g: 1,
    b: 1
}

let callbacks = new Map()

// 缓存
let reactivities = new Map()

let usedReactivities = []

let po = reactive(object)

// 会让这个input跟着po.r的值一起变
// 是从数据到DOM的绑定
effect(() => {
    document.getElementById("r").value = po.r
})
effect(() => {
    document.getElementById("g").value = po.g
})
effect(() => {
    document.getElementById("b").value = po.b
})

// DOM到数据的绑定
document.getElementById("r").addEventListener("input", (e) => {
    po.r = e.target.value
})
document.getElementById("g").addEventListener("input", (e) => {
    po.g = e.target.value
})
document.getElementById("b").addEventListener("input", (e) => {
    po.b = e.target.value
})

effect(() => {
    document.getElementById("color").style.backgroundColor = `rgb(${po.r},${po.g},${po.b})`
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
</script>
```

## 基本拖拽

使用Range和CSSOM做的一个综合练习

一般的拖拽是使用鼠标就能把目标拖到一个固定的位置

我们今天的拖拽要参与到排版当中

```html
<div id="dragable" style="width:100px;height:100px;bacckground-color:pink;"></div>
<script>
    let dragable = document.getElementById("dragable")
    let baseX = 0, baseY = 0
    // 只有按下去之后才有效，所以得从mousedown监听，这样性能和逻辑都正确
    // mousemove和mouseup得在document监听，如果在draggable监听，那么鼠标超过它区域就会拖断，即使移出浏览器，依然是能监听到的
    dragable.addEventListener("mousedown", function(event) {
        let startX = event.clientX, startY = event.clientY
        // 这样removeEventLIstener才会有效
        let up = () => {
            baseX = baseX + event.clientX - startX
            baseY = baseY + event.clientY - startY
            document.removeEventListener("mousemove", move)
            document.removeEventListener("mouseup", up)
        }
        let move = event => {
            dragable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`
        }
        document.addEventListener("mousemove", move)
        document.addEventListener("mouseup", up)
    })
</script>
```

## 正常流里的拖拽拖拽

使用Range和CSSOM做的一个综合练习

一般的拖拽是使用鼠标就能把目标拖到一个固定的位置

我们今天的拖拽要参与到排版当中

```html
<div id="container">文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字
</div>
<div id="dragable" style="width:100px;height:100px;bacckground-color:pink;"></div>
<script>
    let dragable = document.getElementById("dragable")
    let baseX = 0, baseY = 0
    // 只有按下去之后才有效，所以得从mousedown监听，这样性能和逻辑都正确
    // mousemove和mouseup得在document监听，如果在draggable监听，那么鼠标超过它区域就会拖断，即使移出浏览器，依然是能监听到的
    dragable.addEventListener("mousedown", function(event) {
        let startX = event.clientX, startY = event.clientY
        // 这样removeEventLIstener才会有效
        let up = () => {
            baseX = baseX + event.clientX - startX
            baseY = baseY + event.clientY - startY
            document.removeEventListener("mousemove", move)
            document.removeEventListener("mouseup", up)
        }
        let move = event => {
            let range = getNearest(event.clientX, event.clientY)
            range.insertNode(dragable)
            // dragable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`
        }
        document.addEventListener("mousemove", move)
        document.addEventListener("mouseup", up)
    })

    let ranges = []

    let container = document.getElementById("container")
    for(let i = 0; i < container.childNodes[0].textContent.length; i++) {
        let range = document.createRange()
        range.setStart(container.childNodes[0], i)
        range.setEnd(container.childNodes[0], i)

        // CSSOM，会随着页面相关变化而变化，所以不能直接存进来
        console.log(range.getBoundingClientRect())
        ranges.push(range)
    }

    function getNearest(x, y) {
        let min = Infinity
        let nearest = null

        for(let range of ranges) {
            let rect = range.getBoundingClientRect()
            let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2

            if(distance < min) {
                min = distance
                nearest = range
            }
        }

        return nearest
    }

    document.addEventListener("selectStart", (e) => {
        e.preventDefault()
    })
</script>
```