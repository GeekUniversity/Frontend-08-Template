let regexp = /([0-9\.]+)|([ \t]+)|([\n\r]+)|(\+)|(\-)|(\*)|(\/)/g
var dictionary = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]

function tokenize(source) {
    let result = regexp.exec(source)
    while (result) {
        for (let i = 1; i <= result.length; i++) {
            if (result[i]) {
                console.log(dictionary[i - 1])
                break
            }
        }
        // console.log(result)
        result = regexp.exec(source)
    }
}

tokenize("1024 + 10 * 25")