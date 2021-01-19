let regexp = /([0-9\.]+)|([ \t]+)|([\n\r]+)|(\+)|(\-)|(\*)|(\/)/g
var dictionary = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]

function *tokenize(source) {
    let result = null
    let lastIndex = 0
    while (true) {
        lastIndex = regexp.lastIndex
        result = regexp.exec(source)
        let token = {
            type: null,
            value: null
        }
        if (!result) {
            break
        }
        if (regexp.lastIndex - lastIndex > result[0].length) {
            break
        }
        for (let i = 1; i <= result.length; i++) {
            if (result[i]) {
                token.type = dictionary[i - 1]
                break
            }
        }
        token.value = result[0]
        // console.log(result)
        yield token
    }
    yield {
        type: "EOF"
    }
}

let source = []

for (let token of tokenize("10 * 25")) {
    if (token.type !== "WhiteSpace" && token.type !== "LineTerminator") {
        source.push(token)
    }
}

function Expression(tokens) {

}

function AdditiveExpression(source) {

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
    return MultiplicativeExpression(source)
}

console.log(MultiplicativeExpression(source))