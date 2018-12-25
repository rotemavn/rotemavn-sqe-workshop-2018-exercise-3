import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
import {evalCondition, evalString} from './eval';
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
    if(scope == null ){
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

var iterateExpressionsFunctions = {
    'BinaryExpression': iterateBinaryExpression,
    'Literal': iterateLiteral,
    'Identifier': iterateIdentifier,
    'ReturnStatement': iterateReturn,
    'VariableDeclaration': iterateVariableDeclaration,
    'VariableDeclarator': iterateVariableDeclarator,
    'WhileStatement': iterateWhileStatement,
    'ExpressionStatement': iterateExpressionStatement,
    'AssignmentExpression': iterateAssignmentExpression,
    'IfStatement': iterateIfStatement,
    'BlockStatement': iterateBlockStatement,
    'MemberExpression': iterateMemberExpression,
    'ArrayExpression': iterateArrayExpression,
};



function iterateLiteral(ex, scopeNum, color){// eslint-disable-line no-unused-vars
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    return res;
}

function iterateIdentifier(ex, scopeNum, color){// eslint-disable-line no-unused-vars
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    return res;
}

function iterateBinaryExpression(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.left.type](ex.left, scopeNum, color);
    iterateExpressionsFunctions[ex.right.type](ex.right, scopeNum, color);
    return res;
}

function iterateReturn(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.argument.type](ex.argument, scopeNum, color);
    return res;
}

function iterateVariableDeclaration(ex, scopeNum, color){
    var i;
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.declarations = [];
    for(i=0; i<ex.declarations.length; i++){
        res.declarations[i] = iterateExpressionsFunctions[ex.declarations[i].type](ex.declarations[i], scopeNum, color);
    }
    return res;

}

function iterateVariableDeclarator(ex, scopeNum, color){
    var res = JSON.parse(JSON.stringify(ex));
    res.init = iterateExpressionsFunctions[ex.init.type](ex.init, scopeNum, color);
    ex.color = color;
    conditionalAddToValueVector(res.id, res.init, scopeNum);
    return ex;
}

function iterateWhileStatement(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));

    var condition_color = evalCondition(res.test, inputVector, scopes, scopeNum);
    res.test = iterateExpressionsFunctions[ex.test.type](ex.test, scopeNum, color);
    res.test.color = color;
    res.body.body = [];
    var i, body = ex.body.body;
    var scope = scopeNum + 1;
    for(i=0; i<body.length; i++){
        var b = iterateExpressionsFunctions[body[i].type](body[i], scope, condition_color);
        res.body.body.push(b);
    }
    resetScope(scope);
    return res;

}

function iterateExpressionStatement(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.expression = iterateExpressionsFunctions[ex.expression.type](ex.expression, scopeNum, color);
    return res;
}

function iterateAssignmentExpression(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    var right = iterateExpressionsFunctions[ex.right.type](ex.right, scopeNum, color);
    var left = ex.left;
    conditionalAddToValueVector(left, right, scopeNum);
    return res;
}

function getOppositeColor(color){
    if(color === 'green')
        return 'grey';
    return 'green';
}

function iterateIfStatement(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.test = iterateExpressionsFunctions[ex.test.type](ex.test, scopeNum, color);
    var condition_color = evalCondition(res.test, inputVector, scopes, scopeNum);
    res.test.color = color;
    res.consequent.body = [];
    var scope = scopeNum + 1;
    var i, body = ex.consequent.body;
    for(i=0; i<body.length; i++){
        var it = iterateExpressionsFunctions[body[i].type](body[i], scope,condition_color);
        res.consequent.body.push(it);
    }
    resetScope(scope);
    if(res.alternate != null) {
        res.alternate = iterateExpressionsFunctions[res.alternate.type](res.alternate, scopeNum, getOppositeColor(condition_color));
    }
    return res;
}

function iterateBlockStatement(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.body = [];
    var body = ex.body;
    var i;
    for(i=0; i<body.length; i++){
        res.body[i] = iterateExpressionsFunctions[body[i].type](body[i], scopeNum, color);
    }
    return res;
}

function iterateMemberExpression(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.object.type](ex.object, scopeNum, color);
    iterateExpressionsFunctions[ex.property.type](ex.property, scopeNum, color);
    return res;
}

function iterateArrayExpression(ex, scopeNum, color){
    var res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    var elements = ex.elements;
    var i;
    for(i=0; i<elements.length; i++){
        iterateExpressionsFunctions[elements[i].type](elements[i], scopeNum, color);
    }
    return res;
}

function iterateCode(expressions, paramValues, originCode){
    originExpressions = expressions;
    createInputVector(originCode, paramValues);
    var i, func = getFuncObj(originExpressions);
    var funcBody = func.body.body;
    var blockStatement = func.body;
    var newFuncBody = [];
    for(i=0; i<funcBody.length; i++){
        var oldExpr = funcBody[i];
        var newExpr = iterateExpressionsFunctions[oldExpr.type](oldExpr, 0, 'green');
        newFuncBody.push(newExpr);
    }
    blockStatement.body = newFuncBody;

    resFunc = {type: func.type, body: blockStatement, loc: func.loc, expression: func.expression,
        generator: func.generator, id: func.id, params: func.params, async: func.async, range: func.range};

    console.log('origin = ');
    console.log(func.body.body);
    console.log('new = ');
    console.log(newFuncBody);
}


function getOnlyBodyNoReturn(func) {
    var blockStmt = func.body;
    var res =  JSON.parse(JSON.stringify(blockStmt));
    var funcBody = func.body.body;
    var body = [];
    var i;
    for(i=0; i<funcBody.length; i++)
        body.push(func.body.body[i]);
    res.body = body;
    return res;

    
}

///////////////////////////////////////////////////////////

export {iterateCode, createParamVector, restart, getResFunc, getFuncObj, getFuncHTML, getOnlyBodyNoReturn};