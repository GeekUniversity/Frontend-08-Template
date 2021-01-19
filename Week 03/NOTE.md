# 学习笔记 - 使用LL算法构建AST

AST叫做抽象语法树，代码在计算机处理中——
首先会把我们的编程语言去分词，
分词之后下一步，就是把这些词构成层层相嵌套的语法树的这样一个树形结构，
然后下一步才是我们如何去解析我们的代码去执行

构建AST的这种过程又叫做语法分析，最著名的语法分析算法核心的思想有两种——
1. LL算法
2. LR算法

LL（Left-Left）从左到右扫描和归并

## 四则运算

TokenNumber: 1 2 3 4 5 6 7 8 9 0的组合
Operator: + - * / 之一
WhiteSpace: <SP>
LineTerminator: <LF> <CR>

## 正则表达式

```js
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
var dictionary = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]

function tokenize(source) {
	var result = null

	while (true) {
		result = regexp.exec(source)
        if (!result) {
            break
        }

        for (var i = 1; i <= dictionary.length; i ++) {
            if (result[i]) {
                console.log(dictionary[i - 1])
            }
        }
        console.log(result)
	}
}

tokenize("1024 + 10 * 25")
```

## LL词法分析

```js
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
var dictionary = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]

function *tokenize(source) {
	var result = null
	var lastIndex = 0

	while (true) {
		lastIndex = regexp.lastIndex
		result = regexp.exec(source)
        if (!result) {
            break
        }
        // 其实应该throw一个error出来，这里就先不做处理
        if (regexp.lastIndex - lastIndex > result.length) {
            break
        }

        let token = {
            type: null,
            value: null
        }

            for (var i = 1; i <= dictionary.length; i ++) {
                if (result[i]) {
                    token.type = dictionary[i - 1]
                }
            }
            token.value = result[0]
        yield token
	}

	yield {
		type: "EOF"
	}
}

for (let token of tokenize("1024 + 10 * 25")) {
	console.log(token)
}
```

## LL语法分析

基本语法结构：每一个产生式对应着我们的函数

<AdditiveExpression> ::=
	<Number>
	|<MultiplicativeExpression><*><Number>
	|<MultiplicativeExpression></><Number>
	|<AdditiveExpression><+><MultiplicativeExpression>
	|<AdditiveExpression><-><MultiplicativeExpression>

所以先把名字写起来

```js
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
var dictionary = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]

function *tokenize(source) {
	var result = null
	var lastIndex = 0

	while (true) {
		lastIndex = regexp.lastIndex
		result = regexp.exec(source)
        if (!result) {
            break
        }
        // 其实应该throw一个error出来，这里就先不做处理
        if (regexp.lastIndex - lastIndex > result.length) {
            break
        }

        let token = {
            type: null,
            value: null
        }

            for (var i = 1; i <= dictionary.length; i ++) {
                if (result[i]) {
                    token.type = dictionary[i - 1]
                }
            }
            token.value = result[0]
        yield token
	}

	yield {
		type: "EOF"
	}
}

let source = []

for (let token of tokenize("1024 + 10 * 25")) {
	if (token.type !== "Whitespace" && token.type !== "LineTerminator") {
		source.push(token)
	}
}

function Expression(source) {
	if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF") {
		let node = {
			type: "Expression",
			children: [source.shift(), source.shift()]
		}
		source.unshift(node)
		return node
	}
	AdditiveExpression(source)
	return Expression(source)
}

function AdditiveExpression(source) {
	if (source[0].type === "MultiplicativeExpression") {
		let node = {
			type: "AdditiveExpression",
			children: [source[0]]
		}
		source[0] = node
		return AdditiveExpression(source)
	}
	if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "+") {
		let node = {
			type: "AdditiveExpression",
			operator: "+",
			children: []
		}
		node.children.push(source.shift())
		node.children.push(source.shift())
		MultiplicativeExpression(source)
		node.children.push(source.shift())
		source.unshift(node)
		return AdditiveExpression(source)
	}
	if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "-") {
		let node = {
			type: "AdditiveExpression",
			operator: "-",
			children: []
		}
		node.children.push(source.shift())
		node.children.push(source.shift())
		MultiplicativeExpression(source)
		node.children.push(source.shift())
		source.unshift(node)
		return AdditiveExpression(source)
	}
	if (source[0].type === "AdditiveExpression") {
		return source[0]
	}
	MultiplicativeExpression(source)
	return AdditiveExpression(source)
}

function MultiplicativeExpression(source) {
	if (source[0].type === "Number") {
		let node = {
			type: "MultiplicativeExpression",
			children: [source[0]]
		}
		source[0] = node
		return MultiplicativeExpression(source)
	}
	if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "*") {
		let node = {
			type: "MultiplicativeExpression",
			operator: "*",
			children: []
		}
		node.children.push(source.shift())
		node.children.push(source.shift())
		node.children.push(source.shift())
		source.unshift(node)
		return MultiplicativeExpression(source)
	}
	if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "/") {
		let node = {
			type: "MultiplicativeExpression",
			operator: "/",
			children: []
		}
		node.children.push(source.shift())
		node.children.push(source.shift())
		node.children.push(source.shift())
		source.unshift(node)
		return MultiplicativeExpression(source)
	}
	if (source[0].type === "MultiplicativeExpression") {
		return source[0]
	}
	// 不会执行
	return MultiplicativeExpression(source)
}

MultiplicativeExpression(source)
```
