var esprima = require('esprima');

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true, range:true});
};

export {parseCode};