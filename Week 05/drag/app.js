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
        // 位置
        dragable.style.transform = `translate(${lastX + e.clientX - relX}px, ${lastY + e.clientY - relY}px)`
    }
    // 添加事件
    document.addEventListener("mouseup", up)
    document.addEventListener("mousemove", move)
})