/**
 * @var $ 单词终止符
 * @type {Symbol}
 */
let $ = Symbol("$")

/**
 * 字典树结构
 */
class Trie {
    /**
     * 生成结构
     */
    constructor() {
        this.root = Object.create(null)
    }
    /**
     * 往字典树结构插入单词
     * @param {String} word 单词
     */
    insert(word) {
        /**
         * @var node 目前字母节点
         */
        let node = this.root
        // 遍历字母
        for (let char of word) {
            // 字母节点不存在，则添加节点
            if (!(node[char])) {
                node[char] = Object.create(null)
            }
            // node定位到当前字母
            node = node[char]
        }
        // 单词终止，如果终止节点不存在，则添加到词尾
        if (!(node[$])) {
            node[$] = 0
        }
        // 单词频率记录
        node[$]++
    }
    /**
     * 从指定单词的树节点进行遍历，节点达到一定条件就执行回调函数
     * @param {Object} node 当前节点
     * @param {String} word 当前单词
     * @param {(node) => Boolean} condition 条件
     * @param {(node, word: String) => any} conditionCallback 达到条件后进行的回调函数
     */
    findCount(node, word, condition, conditionCallback) {
        // 达到一定条件进行回调
        if (condition(node)) {
            conditionCallback(node, word)
        }
        // 遍历子节点
        for (let char in node) {
            this.findCount(node[char], word+char, condition, conditionCallback)
        }
    }
    /**
     * 字典树结构出现频率最高的单词
     * @typedef {Object} wordResult 单词结果
     * @property {String} word 单词
     * @property {Number} time 单词出现频率
     * @returns {wordResult} 出现频率最多的单词
     */
    most() {
        /**
         * @var maxWord 最大频率单词
         * @type {String}
         */
        let maxWord = ""
        /**
         * @var maxCcount 最大频率单词的出现频率
         * @type {Number}
         */
        let maxCount = 0
        this.findCount(this.root, "", 
                (node) => (node[$] && node[$] > maxCount), 
                (node, word) => {
                    maxWord = word
                    maxCount = node[$]
                })
        return {
            word: maxWord,
            time: maxCount
        }
    }
    /**
     * 字典树结构出现频率最低的单词
     * @returns {wordResult} 出现频率最低的单词
     */
    least() {
        /**
         * @var minWord 最低频率单词
         * @type {String}
         */
        let minWord = ""
        /**
         * @var minCount 最低频率单词的出现频率
         * @type {Number|Boolean} 最初值为false
         */
        let minCount = false
        this.findCount(this.root, "", 
                (node) => ((node[$] && node[$] < minCount) || (node[$] && minCount === false)), 
                (node, word) => {
                    minWord = word
                    minCount = node[$]
                })
        return {
            word: minWord,
            time: minCount
        }
    }
}

/**
 * 生成指定长度的英文单词
 * @param {Number} length 单词长度
 */
function randomWord(length) {
    let result = ""
    for (let i = 0; i < length; i++) {
        // 随机一个英文字母
        result += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0))
    }
    return result
}

let trie = new Trie()

for (let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4))
}
