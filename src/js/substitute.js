import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
import {evalCondition, evalString} from './eval';
import * as escodegen from 'escodegen';
// import $ from "jquery";
// var safeEval = require('safe-eval');

var inputVector = [];
var originExpressions;
var resFunc = {};
var scopes = [];


/// Utils
function varValuesSet(name, value, scope){
    if(scopes[scope] == null || scopes[scope] === undefined)
        scopes[scope] = [];

    var i;
    for(i=0; i<scopes[scope].length; i++) {
        if(scopes[scope][i].name === name) {
            scopes[scope][i].value = value;
            return;
        }
    }
    var newVar = {name: name, value:value};
    scopes[scope].push(newVar);
}

function varValuesGet(ex, scope){
    var i, j;
    var name = findStringRepresentation(ex);
    for(j=scope; j>=0; j--) {
        var values = scopes[j];
        if(values === undefined)
            continue;
        for (i = 0; i < values.length; i++) {
            if (values[i].name === name)
                return values[i].value;
        }
    }
    // return null;

}

function inputVectorGet(ex){
    var i;
    var name = findStringRepresentation(ex);
    for(i=0; i<inputVector.length; i++) {
        if(inputVector[i].name === name)
            return inputVector[i].value;
    }
    return null;

}


function createParamVector(inputP){
    var parsedParams = parseCode(inputP);
    if(parsedParams.body.length === 0)
        return [];
    return parsedParams.body[0].expression.expressions;
}


function restart(){
    inputVector = [];
    scopes = [];
}


function getFuncObj(expressions){
    var i;
    for(i=0; i<expressions.length; i++){
        if(expressions[i].type === 'FunctionDeclaration'){
            return expressions[i].valueObj;
        }
    }
}

// function evaluateOutput(exp){
//     try{
//         if(exp.length === undefined)
//             exp = [exp];
//         var i;
//         var str = '';
//         for(i=0; i<exp.length; i++){
//             var res = evalString(exp[i]);
//             str += res;
//         }
//         return str;
//     }
//     catch (e) {
//         return escodegen.generate(exp);
//     }
// }
function evaluateOutput(exp){
    if(exp.length === undefined)
        exp = [exp];
    var i;
    var str = '';
    for(i=0; i<exp.length; i++){
        var res = evalString(exp[i]);
        str += res;
    }
    return str;

}

function createIfOutput(exp){
    var html = '';
    var test = exp.test;
    var evalTest = '(' + evaluateOutput(test) + ')';
    html = html + '<em style="color:' + test.color + '">if' + evalTest + '</em><br>';
    var consenquent = exp.consequent.body;
    html = html + '{<br>&emsp;' + evaluateOutput(consenquent) + '<br>}';
    if(exp.alternate !== undefined && exp.alternate != null) {
        return html + '<br>else ' + createOutput(exp.alternate) + '<br>';
    }
    else
        return html;
}


function createWhileOutput(exp){
    var html = '';
    var test = exp.test;
    var evalTest = '(' + evaluateOutput(test) + ')';
    html = html + '&emsp;while' + evalTest + '<br>';
    var body = exp.body.body;
    html = html + '&emsp;{<br>&emsp;' + evaluateOutput(body) + '<br>&emsp;}';
    return html;
}

function createOutput(exp){
    // if(exp === undefined || exp == null)
    //     return '';
    var html = '';
    if(exp.type === 'IfStatement'){
        html += createIfOutput(exp);
    }
    else if(exp.type === 'WhileStatement'){
        html +=createWhileOutput(exp);
    }
    else{
        html +='&emsp;' + evaluateOutput(exp) + '<br>';
    }
    return html;

}


function colorOutput(func){
    var funcBody = func.body.body;
    var i;
    var params = '(';
    for(i=0; i<func.params.length; i++){
        if(i>0)
            params += ', ' + func.params[i].name;
        else
            params += func.params[i].name;
    }
    params += ')';

    var html = 'function '+func.id.name + params + '{<br>';
    for(i=0; i<funcBody.length; i++){
        var exp = funcBody[i];
        html = html + createOutput(exp);

    }
    return html + '<br>}';
}

function getFuncHTML(){
    return colorOutput(resFunc);
}


function getResFunc(){
    return resFunc;
}

function resetScope(scopeNum){
    scopes[scopeNum] = [];
}

function conditionalAddToValueVector(res, ex, scopeNum){
    var scope = scopes[scopeNum];
    if(scope == null || scope === undefined){
        scopes[scopeNum] = [];
    }
    varValuesSet(findStringRepresentation(res), ex, scopeNum);

}


///////////////////////////////////////////////////////////

function createNewInitVar(ex, paramValues){
    var initVar;
    var paramValuesIndex=0;
    if(ex.type !== 'FunctionDeclaration'){
        initVar = {name: ex.name, value: ex.valueObj, obj: ex};
        inputVector.push(initVar);
        varValuesSet(ex.name, ex.valueObj, 0);
    }
    else{
        var params = ex.params, i;
        for (i = 0; i < params.length; i++) {
            initVar = {name: params[i].name, value: paramValues[paramValuesIndex], obj: params[i]};
            inputVector.push(initVar);
            varValuesSet(params[i].name, paramValues[paramValuesIndex], 0);
            paramValuesIndex++;
        }

    }
}


function createInputVector(expressions, paramValues){
    var i;
    for(i=0; i<expressions.length; i++){
        var ex = expressions[i];
        createNewInitVar(ex, paramValues);
    }
}


//////////////// Replacement functions ///////////////////////

var replaceExpressionsFunctions = {
    'BinaryExpression': replaceBinaryExpression,
    'Literal': replaceLiteral,
    'Identifier': replaceIdentifier,
    'ReturnStatement': replaceReturn,
    'VariableDeclaration': replaceVariableDeclaration,
    'VariableDeclarator': replaceVariableDeclarator,
    'WhileStatement': replaceWhileStatement,
    'ExpressionStatement': replaceExpressionStatement,
    'AssignmentExpression': replaceAssignmentExpression,
    'IfStatement': replaceIfStatement,
    'BlockStatement': replaceBlockStatement,
    'MemberExpression': replaceMemberExpression,
    'ArrayExpression': replaceArrayExpression,
};



function replaceLiteral(ex, scopeNum){// eslint-disable-line no-unused-vars
    return ex;
}

function replaceIdentifier(ex, scopeNum){// eslint-disable-line no-unused-vars
    var initIdentifier = inputVectorGet(ex);
    if(initIdentifier != null)
        return ex;
    var realValue = varValuesGet(ex, scopeNum);
    if(realValue != null){
        return realValue;
    }
    else
        return ex;
}

function replaceBinaryExpression(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.left = replaceExpressionsFunctions[ex.left.type](ex.left, scopeNum);
    res.right = replaceExpressionsFunctions[ex.right.type](ex.right, scopeNum);


    if(res.left.type === 'Literal' && res.right.type === 'Literal'){
        var val = res.left.value + res.operator + res.right.value;
        var evaluatedValue = eval(val);
        var lit = JSON.parse(JSON.stringify(res.left));
        lit.value = evaluatedValue;
        return lit;
    }

    // addToValueVector(res, ex);

    return res;
}

function replaceReturn(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.argument = replaceExpressionsFunctions[ex.argument.type](ex.argument, scopeNum);
    // addToValueVector(res, ex);
    return res;
}

function replaceVariableDeclaration(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    var i;
    for(i=0; i<ex.declarations.length; i++){
        res.declarations[i] = replaceExpressionsFunctions[ex.declarations[i].type](ex.declarations[i], scopeNum);
    }
    return res;

}

function replaceVariableDeclarator(ex, scopeNum){
    var res = JSON.parse(JSON.stringify(ex));
    res.init = replaceExpressionsFunctions[ex.init.type](ex.init, scopeNum);
    conditionalAddToValueVector(res.id, res.init, scopeNum);
    // addToValueVector(res, ex);
    return res;
}

function replaceWhileStatement(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.test = replaceExpressionsFunctions[ex.test.type](ex.test, scopeNum);
    res.body.body = [];
    var i, body = ex.body.body;
    var scope = scopeNum + 1;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], scope);
        // addToValueVector(exp, body[i]);
        if(checkIfExprIsNecessary(exp))
            res.body.body.push(exp);
    }
    resetScope(scope);
    // addToValueVector(res, ex);
    return res;

}

function replaceExpressionStatement(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.expression = replaceExpressionsFunctions[ex.expression.type](ex.expression, scopeNum);
    return res;
}

function replaceAssignmentExpression(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.right = replaceExpressionsFunctions[ex.right.type](ex.right, scopeNum);
    var left = ex.left;
    conditionalAddToValueVector(left, res.right, scopeNum);
    // addToValueVector(res, ex);
    return res;
}

function replaceIfStatement(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.test = replaceExpressionsFunctions[ex.test.type](ex.test, scopeNum);
    res.test.color = evalCondition(res.test, inputVector, scopes, scopeNum);
    res.consequent.body = [];
    var scope = scopeNum + 1;
    var i, body = ex.consequent.body;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], scope);
        if(checkIfExprIsNecessary(exp))
            res.consequent.body.push(exp);
    }
    resetScope(scope);
    if(res.alternate != null) {

        res.alternate = replaceExpressionsFunctions[res.alternate.type](res.alternate, scopeNum);
    }
    return res;
}

function replaceBlockStatement(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    var body = ex.body;
    res.body = [];
    var i;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], scopeNum);
        // addToValueVector(exp, body[i]);
        if(checkIfExprIsNecessary(exp)) {
            res.body.push(exp);
        }
    }
    return res;
}

function replaceMemberExpression(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    res.object = replaceExpressionsFunctions[ex.object.type](ex.object, scopeNum);
    res.property = replaceExpressionsFunctions[ex.property.type](ex.property, scopeNum);
    return res;
}

function replaceArrayExpression(ex, scopeNum){
    var res =  JSON.parse(JSON.stringify(ex));
    var elements = ex.elements;
    var i;
    for(i=0; i<elements.length; i++){
        res.elements[i] = replaceExpressionsFunctions[elements[i].type](elements[i], scopeNum);
    }
    return res;
}

function checkIfExprIsNecessary(ex){
    if(ex.type === 'VariableDeclaration')
        return false;
    if(ex.type === 'ExpressionStatement')
        ex = ex.expression;
    return !(ex.type === 'AssignmentExpression' && inputVectorGet(ex.left) == null);

}

function substitute(expressions, paramValues, originCode){
    originExpressions = expressions;
    createInputVector(originCode, paramValues);
    var i, func = getFuncObj(originExpressions);
    var funcBody = func.body.body;
    var blockStatement = func.body;
    var newFuncBody = [];
    for(i=0; i<funcBody.length; i++){
        var oldExpr = funcBody[i];
        var newExpr = replaceExpressionsFunctions[oldExpr.type](oldExpr, 0);
        if(checkIfExprIsNecessary(newExpr))
            newFuncBody.push(newExpr);
    }
    blockStatement.body = newFuncBody;

    resFunc = {type: func.type, body: blockStatement, loc: func.loc, expression: func.expression,
        generator: func.generator, id: func.id, params: func.params, async: func.async, range: func.range};
}

///////////////////////////////////////////////////////////

export {substitute, createParamVector, restart, getResFunc, getFuncObj, getFuncHTML};