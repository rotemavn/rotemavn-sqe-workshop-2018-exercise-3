import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
import {evalCondition} from './eval';

var inputVector = [];
var varValues = [];
var startOfFunction = -1;
var endOfFunction = -1;
var originExpressions;
var resFunc = {};


/// Utils

function getInputVector() {
    return inputVector;
}

function varValuesSet(name, value){
    var i;
    for(i=0; i<varValues.length; i++) {
        if(varValues[i].name === name) {
            varValues[i].value = value;
            return;
        }
    }
    var newVar = {name: name, value:value};
    varValues.push(newVar);

}

function varValuesGet(ex){
    var i;
    var name = findStringRepresentation(ex);
    for(i=0; i<varValues.length; i++) {
        if(varValues[i].name === name)
            return varValues[i].value;
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



function findFunctionStartAndEnd(expressions){
    var i;
    for(i=0; i<expressions.length; i++){
        if(expressions[i].type === 'FunctionDeclaration'){
            startOfFunction = expressions[i].line;
            endOfFunction = expressions[i].endLine;
        }
    }
}

function createParamVector(inputP){
    var parsedParams = parseCode(inputP);
    if(parsedParams.body.length === 0)
        return [];
    return parsedParams.body[0].expression.expressions;
}


function restart(){
    inputVector = [];
    varValues = [];
}


function getFuncObj(expressions){
    var i;
    for(i=0; i<expressions.length; i++){
        if(expressions[i].type === 'FunctionDeclaration'){
            return expressions[i].valueObj;
        }
    }
}

function getResFunc(){
    return resFunc;
}

// function addToValueVector(res, ex){
//     // if(res.name === '' || res.name === undefined)
//     //     varValuesSet(findStringRepresentation(res), res, ex);
//     // else
//     //     varValuesSet(res.name, res, ex);
//     varValuesSet(findStringRepresentation(res), res, ex);
// }

function conditionalAddToValueVector(res, ex, toAdd){
    if(toAdd)
        varValuesSet(findStringRepresentation(res), ex);
}


///////////////////////////////////////////////////////////

function createNewInitVar(ex, paramValues){
    var initVar;
    var paramValuesIndex=0;
    if(ex.type !== 'FunctionDeclaration'){
        initVar = {name: ex.name, value: ex.valueObj, obj: ex};
        inputVector.push(initVar);
        varValues.push(initVar);
    }
    else{
        var params = ex.params;
        if(params !== undefined) {
            var i;
            for (i = 0; i < params.length; i++) {
                initVar = {name: params[i].name, value: paramValues[paramValuesIndex], obj: params[i]};
                paramValuesIndex++;
                inputVector.push(initVar);
                varValues.push(initVar);
            }
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
};



function replaceLiteral(ex, toAdd){// eslint-disable-line no-unused-vars
    return ex;
}

function replaceIdentifier(ex, toAdd){// eslint-disable-line no-unused-vars
    var initIdentifier = inputVectorGet(ex);
    if(initIdentifier != null)
        return ex;
    var realValue = varValuesGet(ex);
    if(realValue != null){
        return realValue;
    }
    else
        return ex;
}

function replaceBinaryExpression(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.left = replaceExpressionsFunctions[ex.left.type](ex.left, toAdd);
    res.right = replaceExpressionsFunctions[ex.right.type](ex.right, toAdd);
    // addToValueVector(res, ex);

    return res;
}

function replaceReturn(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.argument = replaceExpressionsFunctions[ex.argument.type](ex.argument, toAdd);
    // addToValueVector(res, ex);
    return res;
}

function replaceVariableDeclaration(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    var i;
    for(i=0; i<ex.declarations.length; i++){
        res.declarations[i] = replaceExpressionsFunctions[ex.declarations[i].type](ex.declarations[i], toAdd);
    }
    return res;

}

function replaceVariableDeclarator(ex, toAdd){
    var res = JSON.parse(JSON.stringify(ex));
    res.init = replaceExpressionsFunctions[ex.init.type](ex.init, toAdd);
    conditionalAddToValueVector(res.id, res.init, toAdd);
    // addToValueVector(res, ex);
    return res;
}

function replaceWhileStatement(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.test = replaceExpressionsFunctions[ex.test.type](ex.test, toAdd);
    res.body.body = [];
    var i, body = ex.body.body;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], false);
        // addToValueVector(exp, body[i]);
        if(checkIfExprIsNecessary(exp))
            res.body.body.push(exp);
    }
    // addToValueVector(res, ex);
    return res;

}

function replaceExpressionStatement(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.expression = replaceExpressionsFunctions[ex.expression.type](ex.expression, toAdd);
    return res;
}

function replaceAssignmentExpression(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.right = replaceExpressionsFunctions[ex.right.type](ex.right);
    var left = ex.left;
    conditionalAddToValueVector(left, res.right, toAdd);
    // addToValueVector(res, ex);
    return res;
}

function replaceIfStatement(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    res.test = replaceExpressionsFunctions[ex.test.type](ex.test, toAdd);
    res.test.color = evalCondition(res.test, inputVector, varValues);
    res.consequent.body = [];
    var i, body = ex.consequent.body;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], false);
        // addToValueVector(exp, body[i]);
        if(checkIfExprIsNecessary(exp))
            res.consequent.body.push(exp);
    }
    if(res.alternate != null)
        res.alternate = replaceExpressionsFunctions[res.alternate.type](res.alternate, false);
    // addToValueVector(res, ex);
    return res;
}

function replaceBlockStatement(ex, toAdd){
    var res =  JSON.parse(JSON.stringify(ex));
    var body = ex.body;
    res.body = [];
    var i;
    for(i=0; i<body.length; i++){
        var exp = replaceExpressionsFunctions[body[i].type](body[i], toAdd);
        // addToValueVector(exp, body[i]);
        if(checkIfExprIsNecessary(exp)) {
            res.body.push(exp);
        }
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
    findFunctionStartAndEnd(expressions);
    createInputVector(originCode, paramValues);
    var i, func = getFuncObj(originExpressions);
    var funcBody = func.body.body;
    var blockStatement = func.body;
    var newFuncBody = [];
    for(i=0; i<funcBody.length; i++){
        var oldExpr = funcBody[i];
        var newExpr = replaceExpressionsFunctions[oldExpr.type](oldExpr, true);
        if(checkIfExprIsNecessary(newExpr))
            newFuncBody.push(newExpr);
    }
    blockStatement.body = newFuncBody;

    resFunc = {type: func.type, body: blockStatement, loc: func.loc, expression: func.expression,
        generator: func.generator, id: func.id, params: func.params, async: func.async, range: func.range};
}

///////////////////////////////////////////////////////////

export {substitute, createParamVector, restart, getResFunc, getFuncObj, getInputVector};