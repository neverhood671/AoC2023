const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const getArrOfNumbersFromStr = require("../utils/getArrOfNumbersFromStr");
const input = readFileToString('input.txt');
const START_RULE_NAME = 'in'

const getFunctionDescription = str => {
    const funBodyStartIndex = str.indexOf('{')
    const funName = str.substring(0, funBodyStartIndex)
    const bodyStr = str.substring(funBodyStartIndex + 1, str.length - 1)
    return [funName, bodyStr]
}

const isPartAccepted = (part, decider) => decider(part)

const isFunctionName = (string) => {
    const nonLowercaseLetters = /[^a-z]/g;
    return !nonLowercaseLetters.test(string);
};

const getCallbackFunction = (callbackStr, rulesMap) => {
    console.log('callbackStr', callbackStr, callbackStr.length)
    return callbackStr === 'A'
        ? '(() => true)'
        : callbackStr === 'R'
            ? '(() => false)'
            : isFunctionName(callbackStr)
                ? buildFunction(callbackStr, rulesMap)
                : buildFunctionFromFunctionDescriptionStr(callbackStr, rulesMap)
}
const buildFunctionFromFunctionDescriptionStr = (functionDescriptionStr, rulesMap) => {
    const firstColonIndex = functionDescriptionStr.indexOf(':')
    const conditionStr = functionDescriptionStr.substring(0, firstColonIndex),
        bodyStr = functionDescriptionStr.substring(firstColonIndex + 1)
    const paramName = conditionStr[0],
        conditionSign = conditionStr[1],
        conditionValue = +conditionStr.substring(2),
        callbackSeparatorIndex = bodyStr.indexOf(','),
        positiveCallbackStr = bodyStr.substring(0, callbackSeparatorIndex),
        negativeCallbackStr = bodyStr.substring(callbackSeparatorIndex + 1);

    const positiveCallback = getCallbackFunction(positiveCallbackStr, rulesMap),
        negativeCallback = getCallbackFunction(negativeCallbackStr, rulesMap),
        functionStr = `return part['${paramName}'] ${conditionSign} ${conditionValue} ? ${positiveCallback}(part) : ${negativeCallback}(part)`

    console.log('functionStr', functionStr)

    return new Function('part', functionStr)
}

const buildFunction = (startFunName, rulesMap) => {
    const functionDescriptionStr = rulesMap[startFunName];
    return buildFunctionFromFunctionDescriptionStr(functionDescriptionStr, rulesMap)
}

const getAnswer = strings => {
    let isRules = true
    const rulesStrings = [],
        parts = []
    strings.forEach(string => {
        if (string.length === 0) {
            isRules = false
        } else if (isRules) {
            rulesStrings.push(getFunctionDescription(string))
        } else {
            const [x, m, a, s] = getArrOfNumbersFromStr(string)
            parts.push({x, m, a, s})
        }
    })


    const rulesMap = rulesStrings.reduce((acc, curr) => {
        acc[curr[0]] = curr[1]
        return acc
    }, {})

    const decider = buildFunction(START_RULE_NAME, rulesMap)

    const res = parts.reduce((acc, curr) => {
        const isAccepted = isPartAccepted(curr, decider)
        console.log('isAccepted', curr, isAccepted)
        if (isAccepted) acc += Object.keys(curr).reduce((sum, key) => sum + curr[key], 0)
        return acc
    }, 0)


    console.log(res)
    return ''
}

writeStringToFile(getAnswer(input), 'answer1.txt');