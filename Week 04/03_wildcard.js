function find(source, pattern) {
    let startCount = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === "*") {
            startCount++;
        }
    }

    if (startCount === 0) {
        for(let i = 0; i < pattern.length; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== "?") {
                return false;
            }
        }
        return;
    }

    let i = 0;
    let lastIndex = 0;
    for (i = 0; pattern[i] !== "*"; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== "?") {
            return false;
        }
    }
    lastIndex = i;

    for (let p = 0; p < startCount - 1; p++) {
        i++;
        let subPattern = "";
        while (pattern[i] !== "*") {
            subPattern += pattern[i];
            i++;
        }

        let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
        reg.lastIndex = lastIndex;
        if (!reg.exec(source)) {
            return false;
        }
        lastIndex = reg.lastIndex;
    }

    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
        if (pattern[pattern.length - j] !== source[source.length - j]
            && pattern[pattern.length = j] !== "?") {
            return false;
        }
    }
    return true;
}

console.log(find("abcabcabxaac", "a*b*bx*c"));
console.log(find("abcabcabxaac", "a*b?*b?x*c"));
