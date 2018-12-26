import {findStringRepresentation} from './strings';

// var safeEval = require('safe-eval');
var scopes;
var scopeNum;

function varValuesGet(ex){
    var i, j;
    var name = findStringRepresentation(ex);
    for(j=scopeNum; j>=0; j--) {
        var values = scopes[j];
        if(values === undefined){
            continue;
        }
        for (i = 0; i < values.length; i++) {
            if (values[i].name === name)
                return values[i].value;
        }
    }
}


var evalExpressions = {
    'BinaryExpression': evalBinaryExpression,
    'Literal': evalLiteral,
    'Identifier': evalIdentifier,
};




function evalBinaryExpression(ex){
    var left = ex.left;
    var right = ex.right;
    var op = ex.operator;
    var l = evalExpressions[left.type](left);
    var r = evalExpressions[right.type](right);
    return l + op + r;
}

function evalLiteral(ex){
    return ex.value;
}

function evalIdentifier(ex){
    var val = varValuesGet(ex);
    return evalExpressions[val.type](val);

}

function evalCondition(condition, inputVector, valueVector, scope){
    scopes = valueVector;
    scopeNum = scope;
    var code = evalExpressions[condition.type](condition);
    var evalRes = eval(code);
    if(evalRes === true)
        return 'green';
    else
        return 'grey';
}

export {evalCondition};