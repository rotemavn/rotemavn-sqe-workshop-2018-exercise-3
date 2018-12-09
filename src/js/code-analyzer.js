var esprima = require('esprima');

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true, range: true, tokens: true});
};

export {parseCode};