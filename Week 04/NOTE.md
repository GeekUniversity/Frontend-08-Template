# 学习笔记

## 字符串分析算法

* 字典树：大量高重复字符串的存储和分析
* KMP：在长字符串里找模式
* WildCard：带通配符的字符串模式
* 正则：字符串通用模式匹配
* 状态机：通用的字符串分析
* LL LR：字符串多层级结构分析

### 字典树（Trie）

```js
let $ = Symbol("$")
// 字典树结构
class Trle {
	constructor() {
		this.root = Object.create(null)
	}
	insert(word) {
		let node = this.root
		for (let c of word) {
			if (!node[c]) {
				node[c] = Object.create(null)
			}
			node = node[c]
		}
		if (!($ in node)) {
			node[$] = 0
		}
		node[$] ++
	}
	// 出现最多的字符数量
	most() {
		let max = 0;
		let maxWord = null;
		let visit = (node, word) => {
			if (node[$] && node[$] > max) {
				max = node[$]
				maxWord = word
			}
			for (let p in node) {
				visit(node[p], word + p)
			}
		}
		visit(this.root, "")
		console.log(maxWord)
	}
}
// 随机生成单词
function randomWord(length) {
	var s = ""
	for (let i = 0; i < length; i++) {
		s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0))
	}
	return s
}
let trie = new Trie()

// 随机生成100000个长度为4的单词
for (let i = 0; i < 100000; i++) {
	trie.insert(randomWord(4))
}
```

## KMP字符串模式匹配算法

模式匹配：查一个字符串（源串）里有没有另一个字符串（pattern串）

要关注pattern自身的自重复行为

**a b c** d **a b c** e
0 0 0 0 0 **1 2 3**

a b a b a b c
0 0 0 1 2 3 4

```js
function kmp(source, pattern) {
	//计算table
	let table = new Array(pattern.length).fill(0)
	{	
		// 从i开始算自重复的数字
		let i = 1, j = 0

		while (i < pattern.length) {
			if (pattern[i] === pattern[j]) {
				++j, ++i
				table[i] = j
			} else {
				if (j > 0) {
					j = table[j]
				} else {
					++i
				}
			}
		}	
	}

	{
		let i = 0, j = 0
		while (i < source.length) {
			if (pattern[j] === source[i]) {
				++i, ++j
			} else {
				if (j > 0) {
					j = table[j]
				} else {
					++i
				}
			}
			if (j === pattern.length) {
				return true
			}
		}
		return false
	}

	//abcdabce
	//aabaaac

	//匹配
}

kmp("", )

// a a b a a a c
// 0 0 1 0 1 2 2

```

Leetcode问题28


## Wildcard

加入了通配符，让字符串的匹配变得没有那么的可控

* wildcard： `ab*c?d*abc*a?d`
	* 只有*：`ab*cd*abc*a?d`
	* 只有?：`c?d，a?d`

```js
function find(source, pattern) {
	// 统计*数量
	let starCount = 0
	for (let i = 0; i < pattern.length; i++) {
		if (pattern[i] === "*") {
			starCount++
		}
	}
	// *数量为0,直接匹配
	if (starCount === 0) {
		for (let i = 0; i < pattern.length; i++) {
			if (pattern[i] !== source[i] && pattern[i] !== "?") {
				return false
			}
		}
		return true
	}

	// 有*，先把第一个*之前的匹配完
	let i = 0
	let lastIndex = 0

	for (i = 0; pattern[i] !== "*"; i++) {
		if (pattern[i] !== source[i] && pattern[i] !== "?") {
			return false
		}
	}

	// *之间，转换成正则表达式，进行一一的匹配，[\\s\\S]代表一切字符
	lastIndex = i

	for (let p = 0; p < starCount - 1; p++) {
		i++
		let subPattern = ""
		while (pattern[i] !== "*") {
			subPattern += pattern[i]
			i++
		}

		let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g")
		reg.lastIndex = lastIndex

		if (!(reg.exec(source))) {
			return false
		}

		lastIndex = reg.lastIndex
	}

	// 从尾部到lastIndex的字符进行遍历，遇到*则停止
	for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
		if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") {
			return false
		}
	}
	return true
}
```

```js
function find(source, pattern) {
	// 统计*数量
	
	// *数量为0,直接匹配

	// 有*，先把第一个*之前的匹配完

	// *之间，转换成正则表达式，进行一一的匹配，[\\s\\S]代表一切字符

	// 从尾部到lastIndex的字符进行遍历，遇到*则停止

}
```