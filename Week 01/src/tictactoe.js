let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

const board_size = 3;
const full_color = 3;
let color = 1;

function show() {
    let board = document.getElementById("board");
    board.innerText = "";

    for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText =
                pattern[j][i] == 2 ? "❌":
                    pattern[j][i] == 1 ? "🚱" : "";
            cell.addEventListener("click", ()=> move(i, j));
            board.appendChild(cell);
        }
        board.appendChild(document.createElement("br"));
    }
}

function move(x, y) {
    pattern[y][x] = color;
    if (check(pattern, color)) {
        alert(color == 2 ? "❌ is winner!" : "🚱 is winner!");
    }
    color = full_color - color;
    show();
}

function check(pattern, color) {
    // 判断行
    for (let i = 0; i < board_size; i++) {
        let win = true;
        for (let j = 0; j < board_size; j++) {
            if (pattern[i][j] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    // 判断列
    for (let i = 0; i < board_size; i++) {
        let win = true;
        for (let j = 0;j < board_size; j++) {
            if (pattern[j][i] !== color) {
                win = false;
            }
        }
        if (win) {
            return false;
        }
    }
    // 判断斜向
    {
        let win = true;
        for (let j = 0; j < board_size; j++) {
            if (pattern[j][2-j] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    {
        let win = true;
        for (let j = 0; j < board_size; j++) {
            if (pattern[j][j] !== color) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }

    return false;
}

function clone(pattern) {
    // return Object.create(pattern);
    return JSON.parse((JSON).stringify(pattern));
}



function willWon(pattern, color) {
    for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            if (pattern[i][j]) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if (check(tmp, color)) {
                return [j, i];
            }
        }
    }

    return null;
}

let worst_ret = -2;
let best_res = 1;
let ok_res = 0;

function bestChoice(pattern, color) {
    let p;
    if (p = willWon(pattern, color)) {
        return {
            point: p,
            result: 1
        }
    }

    let result = -2;
    let point = null;
    outer:for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            if (pattern[i][j]) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            let r = bestChoice(tmp, full_color - color).result;

            if (- r > result) {
                result = -r;
                point = [j, i];
            }

            if (result == best_res) {
                break outer;
            }
        }
    }
    // 双方走完了，和棋
    return {
        point: point,
        result: point ? result: ok_res
    }
}

show(pattern);