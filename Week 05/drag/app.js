let dragable = document.getElementById("dragable")

// 上一次物体落在的方位
let lastX = 0, lastY = 0

// 鼠标按下时才触发相关事件
dragable.addEventListener("mousedown", event => {
    // Mousedown的时候，鼠标相对这个物体的位置值
    let relX = event.clientX, relY = event.clientY
    let up = e => {
        // 记录落在的方位
        lastX = e.clientX
        lastY = e.clientY
        // 移除事件
        document.removeEventListener("mouseup", up)
        document.removeEventListener("mousemove", move)
    }
    let move = e => {
        // 移动了多少
        let moveX = e.clientX, moveY = e.clientY
        // 把dragable移动到对应位置
        // dragable.style.transform = `translate(${lastX + moveX - relX}px, ${lastY + moveY - relY}px)`
        getNearest(moveX, moveY).insertNode(dragable)
    }
    // 添加事件
    document.addEventListener("mouseup", up)
    document.addEventListener("mousemove", move)
})

// 文字层
let container = document.getElementById("container")

let ranges = []

// 将container里面的文字节点的每个字符转化为range，并储存
for(let i = 0; i < container.childNodes[0].textContent.length; i++) {
    let range = document.createRange()

    // 设置起点和终点
    range.setStart(container.childNodes[0], i)
    range.setEnd(container.childNodes[0], i)

    console.log(range.getBoundingClientRect())

    // 储存
    ranges.push(range)
}


/**
 * dragable移动后距离最近的文字节点
 * @param {number} clientX dragable移动后横坐标
 * @param {number} clientY dragable移动后纵坐标
 * @returns {Range} dragable移动后距离最近的文字节点
 */
function getNearest(clientX, clientY) {
    let nearestDis = Infinity
    let nearestNode = null

    // 遍历ranges
    for(let range of ranges) {
        let {x, y} = range.getBoundingClientRect()
        let distance = (clientX - x) ** 2 + (clientY - y) ** 2

        // 距离更近？记录
        if(distance < nearestDis) {
            nearestDis = distance
            nearestNode = range
        }
    }

    return nearestNode
}

// 选中效果去除
document.addEventListener("selectstart", e => e.preventDefault())