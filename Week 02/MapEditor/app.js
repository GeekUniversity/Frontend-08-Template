const map = localStorage['map'] ? JSON.parse(localStorage['map']) : Array(10000).fill(0)
const mapArea = document.getElementById('map')

for (let i = 0; i < 10000; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    if (map[i] === 1) {
        cell.style.backgroundColor = '#000'
    }
    cell.addEventListener("mousemove", () => {
        if (mousedown) {
            if (canceled) {
                map[i] = 0
                cell.style.removeProperty('background-color')
            } else {
                map[i] = 1
                cell.style.backgroundColor = '#000'
            }
        }
    })
    mapArea.appendChild(cell)
}

let mousedown = false
let canceled = false

document.addEventListener('mousedown', e => {
    mousedown = true
    canceled = e.which === 3 ? true : false
})

document.addEventListener('mouseup', e => {
    mousedown = false
})

document.addEventListener('contextmenu', e => {
    e.preventDefault()
})

/**
 * 保存地图
 */
function save() {
    localStorage['map'] = JSON.stringify(map)
    alert('保存成功')
}

/**
 * 睡眠一定时间，到时间解决的Promise
 * @param {number} t 时间间隔
 * @returns {Promise}
 */
function sleep(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t)
    })
}

/**
 * 广度寻路
 * @param {number[]} map 地图
 * @param {number[]} start 起点
 * @param {number[]} end 终点
 */
async function path(map, start, end) {
    const queue = new Sorted([start], (a, b) => distance(a) - distance(b))
    const pathTable = Object.create(map)

    /**
     * 把该点推到队列，并且把该点的前一点记录下来
     * @param {number} x 该点的横坐标
     * @param {number} y 该点的纵坐标
     * @param {number[]} pre 前面一个点的坐标
     */
    async function insert(x, y, pre) {
        // 越过边界
        if (x < 0 || x === 100 || y < 0 || y === 100) {
            return
        }
        // 点不为空
        if (pathTable[y*100+x]) {
            return
        }

        await sleep(5)
        mapArea.children[y*100+x].style.backgroundColor = 'lightgreen'
        pathTable[y*100+x] = pre

        // 进队尾
        queue.give([x, y])
    }

    function distance(point) {
        return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
    }

    while (queue.length()) {
        // 取队首
        const [x, y] = queue.take()
        console.log(x, y)
        // 终点
        if (x === end[0] && y === end[1]) {
            let path = [[x, y]]
            let [x1, y1] = [x, y]

            mapArea.children[y*100+x].style.backgroundColor = 'purple'

            while (x1 !== start[0] || y1 !== start[1]) {
                [x1, y1] = pathTable[y1*100+x1]
                await sleep(30)
                mapArea.children[y1*100+x1].style.backgroundColor = 'purple'
                path.push([x1, y1])
            }
            return path
        }
        // 左下右上
        await insert(x-1, y, [x, y])
        await insert(x, y-1, [x, y])
        await insert(x+1, y, [x, y])
        await insert(x, y+1, [x, y])
        // 斜方向
        await insert(x-1, y-1, [x, y])
        await insert(x-1, y+1, [x, y])
        await insert(x+1, y-1, [x, y])
        await insert(x+1, y+1, [x, y])
    }

    return null
}

/**
 * 排序的数据结构
 */
class Sorted {
    /**
     * 建立排序的数据结构
     * @param {*[]} data 数组
     * @param {function} compare 比较函数
     */
    constructor(data, compare) {
        this.data = data.slice()
        this.compare = compare || ((a, b) => a - b)
    }

    length() {return this.data.length}

    /**
     * 取出最小的元素
     */
    take() {
        if (!this.data.length) {
            return
        }

        let min = this.data[0]
        let minIndex = 0

        for (let i = 1; i < this.data.length; i++) {
            if (this.compare(min, this.data[i]) > 0) {
                min = this.data[i]
                minIndex = i
            }
        }

        this.data[minIndex] = this.data[this.data.length - 1]
        this.data.pop()
        return min
    }

    /**
     * 加入新数值
     * @param {*} v 新数值
     */
    give(v) {
        this.data.push(v)
    }
}