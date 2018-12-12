import {findStringRepresentation} from './strings';
import * as escodegen from 'escodegen';

// var safeEval = require('safe-eval');
var scopes;
var scopeNum;

function varValuesGet(ex){
    var i, j;
    var name = findStringRepresentation(ex);
    for(j=scopeNum; j>=0; j--) {
        var values = scopes[j];
        for (i = 0; i < values.length; i++) {
            if (values[i].name === name)
                return values[i].value;
        }
    }
    // return null;

}

// function inputVectorGet(ex){
//     var i;
//     var name = findStringRepresentation(ex);
//     for(i=0; i<inputVector.length; i++) {
//         if(inputVector[i].name === name)
//             return inputVector[i].value;
//     }
//     return null;
//
// }



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
    // if(typeof l === 'number' && typeof r === 'number'){
    //     var val = safeEval(l + op + r);
    //     return {type: 'Literal', value:val};
    // }
    // else
    //     return l + op + r;
    return l + op + r;
}

function evalLiteral(ex){
    return ex.value;
}

function evalIdentifier(ex){
    var val = varValuesGet(ex);
    return evalExpressions[val.type](val);

}

function evalString(str){
    if(str.type !== 'BinaryExpression')
        return escodegen.generate(str);
    else
        return binaryExpressionToString(str);
}


function decodeHtml(str) {
    var map =
        {
            '&': '&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            '\'':'&#039;',
        };
    return str.replace(/&|<|>|"|'/g, function (m) { return map[m];

    });}

function binaryExpressionToString(ex){
    var left = ex.left;
    var right = ex.right;
    var op = ex.operator;
    var decOp = decodeHtml(op);
    return evalString(left) + decOp + evalString(right);
}

function evalCondition(condition, inputVector, valueVector, scope){
    scopes = valueVector;
    scopeNum = scope;
    var code = evalExpressions[condition.type](condition);
    var evalRes = eval(code);
    if(evalRes === true)
        return 'green';
    else
        return 'red';


}

export {evalCondition, evalString};