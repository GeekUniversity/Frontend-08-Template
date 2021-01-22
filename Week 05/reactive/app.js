let usedReactivities = []
let callbacks = new Map()

let proxied = {
    a: 1,
    b: 2
}

let po = reactive(proxied)

effect(() => {
    console.log(po.a)
})

po.a = 3

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
    return new Proxy(object, {
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
            return obj[prop]
        }
    })
}