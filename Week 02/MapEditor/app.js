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
 * 广度寻路
 * @param {number[]} map 地图
 * @param {number[]} start 起点
 * @param {number[]} end 终点
 */
function path(map, start, end) {
    const queue = [start]

    function insert(x, y) {
        // 越过边界
        if (x < 0 || x === 100 || y < 0 || y === 100) {
            return
        }
        // 走过了
        if (map[y*100+x] === 2) {
            return
        }
        map[y*100+x] = 2
        // 进队尾
        queue.push([x, y])
    }

    while (queue.length) {
        // 取队首
        const [x, y] = queue.shift()
        // 终点
        if (x === end[0] && y === end[1]) {
            return true
        }
        // 左下右上
        insert(x-1, y)
        insert(x, y-1)
        insert(x+1, y)
        insert(x, y+1)
    }

    return false
}