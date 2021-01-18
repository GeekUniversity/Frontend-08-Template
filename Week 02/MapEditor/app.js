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