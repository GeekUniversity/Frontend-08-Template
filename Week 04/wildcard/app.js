/**
 * 带*或是带?的目标字符串的查找
 * @param {String} source 源字符串
 * @param {String} pattern 目标字符串
 * @returns {Boolean} 是否找到
 */
function find(source, pattern) {
	// 统计*数量
    let starCount = 0
    for (let char of pattern) {
        if (char === "*") {
            starCount++
        }
    }
	// *数量为0,直接匹配
    if (starCount === 0) {
        for (let i in pattern) {
            if (source[i] !== pattern[i] && pattern[i] !== "?") {
                return false
            }
        }
        return true
    }
    // 有*，先把第一个*之前的匹配完
    let lastIndex
    for (lastIndex = 0; lastIndex < pattern.length && pattern[lastIndex] !== "*"; lastIndex++) {
        if (source[lastIndex] !== pattern[lastIndex] && pattern[lastIndex] !== "?") {
            return false
        }
    }
	// *之间，转换成正则表达式，进行一一的匹配，[\\s\\S]代表一切字符
    for (let i = 0; i < starCount; i++) {
        // 这里不要用lastIndex进行while循环，在下面匹配时要用到
        let j = lastIndex + 1
        let subPattern = ""
        // 将下一个星号之前的内容收集
        while (pattern[j] && pattern[j] !== "*") {
            subPattern += pattern[j++]
        }
        // 转换成正则表达式，进行一一的匹配，[\\s\\S]代表一切字符
        let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g")
        reg.lastIndex = lastIndex

        if (!reg.exec(source)) {
            return false
        }

        lastIndex = reg.lastIndex
    }
	// 从尾部到lastIndex的字符进行遍历，遇到*则停止
    for (let i = 1; source.length - i >= lastIndex && pattern[pattern.length - i] !== "*"; i++) {
        if (source[source.length - i] !== pattern[pattern.length - i] && pattern[pattern.length - i] !== "?") {
            return false
        }
    }
    return true
}

console.log(find("aabbccdd","a*b*c?f"))