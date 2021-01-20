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
