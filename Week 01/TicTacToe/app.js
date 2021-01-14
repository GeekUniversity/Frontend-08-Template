document.body.style.height = window.innerHeight + 'px';
document.body.style.width = window.innerWidth + 'px';
const toeplace = document.getElementById('toeplace');
if (parseInt(getComputedStyle(toeplace).width) > window.innerHeight) {
    toeplace.style.height = window.innerHeight + 'px';
} else {
    toeplace.style.height = window.style.width + 'px';
}

const pattern = [
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 0]
];

let color = 1;

show();

/**
 * 下一步棋
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 */
function move(x, y) {
    pattern[y][x] = color;
    if (check(pattern, x, y)) {
        alert(`${color === 1 ? "⭕" : "❌"}赢了`);
        color = 0;
        show();
    } else {
        color = 3 - color;
        show();
    }
}

/**
 * 检查当前棋子的输赢
 * @param {number[][]} pattern 棋局
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 */
function check(pattern, x, y) {
    // 当前坐标处于左对角线
    if (x === y) {
        let res = true;
        for (let index in pattern) {
            if (pattern[index][index] !== color) {
                res = false;
                break;
            }
        }
        if (res) {
            return res
        }
    }
    // 当前坐标处于右对角线
    else if (x + y === 2) {
        let res = true;
        for (let index in pattern) {
            if (pattern[index][2 - index] !== color) {
                res = false;
                break;
            }
        }
        if (res) {
            return res;
        }
    }
    // 行检查
    {
        let res = true;
        for (let index in pattern[y]) {
            if (pattern[y][index] !== color) {
                res = false;
                break;
            }
        }
        if (res) {
            return res;
        }
    }
    // 列检查
    {
        let res = true;
        for (let index in pattern) {
            if (pattern[index][x] !== color) {
                res = false;
                break;
            }
        }
        if (res) {
            return res;
        }
    }
    return false
}

/**
 * 显示棋盘
 */
function show() {
    toeplace.innerHTML = "";
    for (let y in pattern) {
        for (let x in pattern[y]) {
            const spot = document.createElement('div');
            spot.classList.add('toespot');
            spot.innerText = pattern[y][x] === 1 ? "⭕" :
                pattern[y][x] === 2 ? "❌" : "";
            if (color !== 0) {
                spot.addEventListener('click', () => {
                    if (pattern[y][x] === 0) {
                        move(parseInt(x), parseInt(y))
                    }
                })
            }
            toeplace.appendChild(spot);
            const height = parseInt(getComputedStyle(toeplace).height) / 3;
            spot.style.height = height + 'px';
            spot.style.lineHeight = height + 'px';
            spot.style.fontSize = 0.5 * height + 'px';
        }
    }
}