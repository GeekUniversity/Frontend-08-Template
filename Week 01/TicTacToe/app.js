document.body.style.height = window.innerHeight + 'px';
document.body.style.width = window.innerWidth + 'px';
const toeplace = document.getElementById('toeplace');
if (parseInt(getComputedStyle(toeplace).width) > window.innerHeight) {
    toeplace.style.height = window.innerHeight + 'px';
} else {
    toeplace.style.height = window.style.width + 'px';
}

const pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let color = 1, round = 0;

show();

/**
 * 最好的动作
 * @typedef {object} moveResult 最好的结果
 * @property {number[]} point 最好的点
 * @property {number} result 最好的结果，1赢，-1输，平局
 * 
 * @param {number[][]} pattern 当前棋局
 * @param {number} color 当前颜色
 * @returns {...moveResult} 最好的点和结果
 */
function bestMove(pattern, color) {
    let p;
    if (p = willWin(pattern, color)) {
        return {
            point: p,
            result: 1
        }
    } else {
        let result = -2;
        let point = null;
        for (let y in pattern) {
            for (let x in pattern[y]) {
                if (pattern[y][x]) {
                    continue
                }
                let pattern2 = copyPattern(pattern);
                pattern2[y][x] = color;
                let res = bestMove(pattern2, 3 - color).result;

                // if (color === 2) 
                //     console.log(x, y, -res, color, "round ", round)

                if (- res > result) {
                    result = - res;
                    point = [x, y];
                }
            }
        }

        return {
            point,
            result: point ? result : 0
        }
    }
}

/**
 * 下一步棋
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 */
function move(x, y) {
    pattern[y][x] = color;
    round++;
    if (check(pattern, x, y, color)) {
        alert(`${color === 1 ? "⭕" : "❌"}赢了`);
        color = 0;
        show();
    } else {
        color = 3 - color;
        show();
        if (round === 9) {
            alert("平局");
        } else if (color === 2) {
            let tMove = bestMove(pattern, color).point;
            move(tMove[0], tMove[1]);
        }
    }
}

/**
 * 当前棋子颜色是否要赢
 * @param {number[][]} pattern 棋局
 * @param {number} color 当前棋子颜色
 * @returns {number[]|null} 能赢就输出赢的点，反之输出null
 */
function willWin(pattern, color) {
    for (let y in pattern) {
        for (let x in pattern[y]) {
            if (pattern[y][x]) {
                continue;
            }
            let pattern2 = copyPattern(pattern);
            pattern2[y][x] = color;
            if (check(pattern2, x, y, color)) {
                return [x, y]
            }
        }
    }
    return null
}

/**
 * 复制当前棋局进行模拟用
 * @param {number[][]} pattern 棋局
 * @returns {number[][]} 拷贝
 */
function copyPattern(pattern) {
    return JSON.parse(JSON.stringify(pattern));
}

/**
 * 检查当前棋子的输赢
 * @param {number[][]} pattern 棋局
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 */
function check(pattern, x, y, color) {
    // 检查对角线
    {
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
    {
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