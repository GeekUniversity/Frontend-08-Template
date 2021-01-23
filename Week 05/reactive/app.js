/**
 * @var usedReactivities 使用过的reactivities
 * @type {Proxy[]}
 */
let usedReactivities = []
/**
 * @var reactivities 缓存
 * @type {Map}
 */
let reactivities = new Map()
/**
 * @var callbacks 各属性对应的回调函数
 * @type {Map}
 */
let callbacks = new Map()

let proxied = {
    r: 0,
    g: 0,
    b: 0
}

let po = reactive(proxied)

/**
 * 利用reactive和addEventListener做的双向绑定
 * @param {String} id 目标div的ID值
 * @param {Proxy} obj 目标Proxy对象
 */
function bidirectionalBind(id, obj) {
    effect(() => {
        document.getElementById(id).value = obj[id]
    })
    document.getElementById(id).addEventListener("input", e => {
        obj[id] = e.target.value
    })
}

/**
 * 利用双向绑定做的调色盘
 * @param {Proxy} obj 目标Proxy对象
 */
function app(obj) {
    bidirectionalBind("r", obj)
    bidirectionalBind("g", obj)
    bidirectionalBind("b", obj)
    effect(() => {
        document.getElementById("color").style.backgroundColor = `rgb(${obj.r},${obj.g},${obj.b})`
    })
}

app(po)

/**
 * 指定函数中涉及到的Object属性加上这个回调函数
 * @param {Function} callback 回调函数
 */
function effect(callback) {
    // 清空usedReactivities
    usedReactivities = []
    
    // 执行callback
    callback()

    for (let reactivity of usedReactivities) {
        // 确定这些reactivities有自己的队列
        if (!callbacks.get(reactivity[0])) {
            callbacks.set(reactivity[0], new Map())
        }
        if (!callbacks.get(reactivity[0]).get(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], [])
        }
        // 涉及的属性加上callback
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
    }

}

/**
 * 简易Reactive
 * @param {Object} object Reactive代理的对象
 * @returns {Proxy} 简易Reactive
 */
function reactive(object) {
    if (reactivities.get(object)) {
        return reactivities.get(object)
    }
    let proxy = new Proxy(object, {
        /**
         * 设置属性回调
         * @param {Object} obj 代理的对象
         * @param {*} prop 涉及的属性
         * @param {*} val 给对象对应属性设置的值
         * @returns {*} 同val
         */
        set(obj, prop, val) {
            obj[prop] = val
            // 执行回调
            if (callbacks.get(obj) && callbacks.get(obj).get(prop)) {
                for (let callback of callbacks.get(obj).get(prop)) {
                    callback()
                }
            }
            return val
        },
        /**
         * 得到属性对应的值
         * @param {Object} obj 代理的对象
         * @param {*} prop 涉及的属性
         * @returns {*} 得到的值
         */
        get(obj, prop) {
            // 记录这个属性
            usedReactivities.push([obj, prop])

            // 如果是Object，则转为Reactive对象
            if (typeof obj[prop] === "object") {
                return reactive(obj[prop])
            }
            return obj[prop]
        }
    })
    reactivities.set(object, proxy)
    return proxy
}