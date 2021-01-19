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

for (let token of tokenize("1024 + 10 * 25")) {
    console.log(token)
}