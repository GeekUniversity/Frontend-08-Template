/**
 * KMP算法判断源字符串是否包含目标字符串
 * @param {String} source 源字符串
 * @param {String} pattern 目标字符串
 */
function kmp(source, pattern) {
    /**
     * @var table 目标字符串自重复表格
     * @type {Number[]}
     */
    let table = new Array(pattern.length).fill(0)
    // 目标字符串自重复
    {
        /**
         * @var i 当前字符
         */
        let i = 1
        /**
         * @var j 尝试匹配字符，也是匹配字符数量
         */
        let j = 0
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                // 匹配时，给上一个匹配字符的后面一个字符的位置标记匹配数量
                i++, j++
                table[i] = j
            } else {
                // 不匹配
                if (j > 0) {
                    // 匹配数量返回上一个匹配字符的后面一个字符，也是匹配字符的后一个位置
                    j = table[j]
                } else {
                    // 匹配数量见底，当前字符只好往前
                    i++
                }
            }
        }
    }

    // 目标字符串查找
    {
        /**
         * @var i 源字符位置
         */
        let i = 0
        /**
         * @var j 目标字符位置，也是匹配字符数量
         */
        let j = 0
        while (i < source.length) {
            if (source[i] === pattern[j]) {
                // 匹配时
                i++, j++
            } else {
                if (j > 0) {
                    // 匹配数量返回上一个匹配字符的后面一个字符，也是匹配字符的后一个位置
                    j = table[j]
                } else {
                    // 匹配数量见底，当前源字符位置只好往前
                    i++
                }
            }
            // 目标字符完全匹配
            if (j === pattern.length) {
                return true
            }
        }
        return false
    }
}

console.log(kmp("Helxlo", "ll"))