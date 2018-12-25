import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
import {evalCondition} from './eval';


let inputVector = [];
let originExpressions;
let resFunc = {};
let scopes = [];



let classFunctions = {
    'varValuesSet': varValuesSet,
    'createParamVector':createParamVector,
    'getFuncObj': getFuncObj,
    'conditionalAddToValueVector': conditionalAddToValueVector,
    'createNewInitVar': createNewInitVar,
    'createInputVector': createInputVector,
    'iterateBinaryExpression': iterateBinaryExpression,
    'iterateLiteral': iterateLiteral,
    'iterateIdentifier': iterateIdentifier,
    'iterateReturn': iterateReturn,
    'iterateVariableDeclaration': iterateVariableDeclaration,
    'iterateVariableDeclarator': iterateVariableDeclarator,
    'iterateWhileStatement': iterateWhileStatement,
    'iterateExpressionStatement': iterateExpressionStatement,
    'iterateAssignmentExpression': iterateAssignmentExpression,
    'iterateIfStatement': iterateIfStatement,
    'iterateBlockStatement': iterateBlockStatement,
    'iterateMemberExpression': iterateMemberExpression,
    'iterateArrayExpression': iterateArrayExpression,
    'getOppositeColor': getOppositeColor,
    'iterateCode': getResFuncBody,
    'getScopes': getScopes,
    'resetScope': resetScope,

};



/// Utils

function getScopes(){
    return scopes;
}

function testFunction(functionName, params){
    return classFunctions[functionName].apply(null, params);
}

function varValuesSet(name, value, scope){
    if(scopes[scope] == null || scopes[scope] === undefined)
        scopes[scope] = [];

    let i;
    for(i=0; i<scopes[scope].length; i++) {
        if(scopes[scope][i].name === name) {
            scopes[scope][i].value = value;
            return;
        }
    }
    let newVar = {name: name, value:value};
    scopes[scope].push(newVar);
}

function createParamVector(inputP){
    let parsedParams = parseCode(inputP);
    if(parsedParams.body.length === 0)
        return [];
    let partOfRet = parsedParams.body[0].expression;
    if(partOfRet.expressions === undefined)
        return partOfRet;
    return partOfRet.expressions;
}


function restartFindPath(){
    inputVector = [];
    scopes = [];
}


function getFuncObj(expressions){
    let i;
    for(i=0; i<expressions.length; i++){
        if(expressions[i].type === 'FunctionDeclaration'){
            return expressions[i].valueObj;
        }
    }
}

function resetScope(scopeNum){
    scopes[scopeNum] = [];
}

function conditionalAddToValueVector(id, ex, scopeNum){
    let scope = scopes[scopeNum];
    if(scope == null ){
        scopes[scopeNum] = [];
    }
    varValuesSet(findStringRepresentation(id), ex, scopeNum);

}


///////////////////////////////////////////////////////////

function createNewInitVar(ex, paramValues){
    let initVar;
    let paramValuesIndex=0;
    if(ex.type !== 'FunctionDeclaration'){
        initVar = {name: ex.name, value: ex.valueObj, obj: ex};
        inputVector.push(initVar);
        varValuesSet(ex.name, ex.valueObj, 0);
    }
    else{
        let params = ex.params, i;
        for (i = 0; i < params.length; i++) {
            initVar = {name: params[i].name, value: paramValues[paramValuesIndex], obj: params[i]};
            inputVector.push(initVar);
            varValuesSet(params[i].name, paramValues[paramValuesIndex], 0);
            paramValuesIndex++;
        }

    }
}


function createInputVector(expressions, paramValues){
    let i;
    for(i=0; i<expressions.length; i++){
        let ex = expressions[i];
        createNewInitVar(ex, paramValues);
    }
}


//////////////// Replacement functions ///////////////////////

let iterateExpressionsFunctions = {
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
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    return res;
}

function iterateIdentifier(ex, scopeNum, color){// eslint-disable-line no-unused-vars
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    return res;
}

function iterateBinaryExpression(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.left.type](ex.left, scopeNum, color);
    iterateExpressionsFunctions[ex.right.type](ex.right, scopeNum, color);
    return res;
}

function iterateReturn(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.argument.type](ex.argument, scopeNum, color);
    return res;
}

function iterateVariableDeclaration(ex, scopeNum, color){
    let i;
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.declarations = [];
    for(i=0; i<ex.declarations.length; i++){
        res.declarations[i] = iterateExpressionsFunctions[ex.declarations[i].type](ex.declarations[i], scopeNum, color);
    }
    return res;

}

function iterateVariableDeclarator(ex, scopeNum, color){
    let res = JSON.parse(JSON.stringify(ex));
    res.init = iterateExpressionsFunctions[ex.init.type](ex.init, scopeNum, color);
    ex.color = color;
    conditionalAddToValueVector(res.id, res.init, scopeNum);
    return ex;
}

function iterateWhileStatement(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));

    let condition_color = evalCondition(res.test, inputVector, scopes, scopeNum);
    res.test = iterateExpressionsFunctions[ex.test.type](ex.test, scopeNum, color);
    res.test.color = color;
    res.body.body = [];
    let i, body = ex.body.body;
    let scope = scopeNum + 1;
    for(i=0; i<body.length; i++){
        let b = iterateExpressionsFunctions[body[i].type](body[i], scope, condition_color);
        res.body.body.push(b);
    }
    resetScope(scope);
    return res;

}

function iterateExpressionStatement(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.expression = iterateExpressionsFunctions[ex.expression.type](ex.expression, scopeNum, color);
    return res;
}

function iterateAssignmentExpression(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    let right = iterateExpressionsFunctions[ex.right.type](ex.right, scopeNum, color);
    let left = ex.left;
    conditionalAddToValueVector(left, right, scopeNum);
    return res;
}

function iterateIfStatement(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.test = iterateExpressionsFunctions[ex.test.type](ex.test, scopeNum, color);
    let condition_color = evalCondition(res.test, inputVector, scopes, scopeNum);
    res.test.color = color;
    res.consequent.body = [];
    let scope = scopeNum + 1;
    let i, body = ex.consequent.body;
    for(i=0; i<body.length; i++){
        let it = iterateExpressionsFunctions[body[i].type](body[i], scope,condition_color);
        res.consequent.body.push(it);
    }
    resetScope(scope);
    if(res.alternate != null) {
        res.alternate = iterateExpressionsFunctions[res.alternate.type](res.alternate, scopeNum, getOppositeColor(condition_color));
    }
    return res;
}

function iterateBlockStatement(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    res.body = [];
    let body = ex.body;
    let i;
    for(i=0; i<body.length; i++){
        res.body[i] = iterateExpressionsFunctions[body[i].type](body[i], scopeNum, color);
    }
    return res;
}

function iterateMemberExpression(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    iterateExpressionsFunctions[ex.object.type](ex.object, scopeNum, color);
    iterateExpressionsFunctions[ex.property.type](ex.property, scopeNum, color);
    return res;
}

function iterateArrayExpression(ex, scopeNum, color){
    let res =  JSON.parse(JSON.stringify(ex));
    res.color = color;
    let elements = ex.elements;
    let i;
    for(i=0; i<elements.length; i++){
        iterateExpressionsFunctions[elements[i].type](elements[i], scopeNum, color);
    }
    return res;
}

function iterateCode(expressions, paramValues, originCode){
    originExpressions = expressions;
    createInputVector(originCode, paramValues);
    let i, func = getFuncObj(originExpressions);
    let funcBody = func.body.body;
    let blockStatement = func.body;
    let newFuncBody = [];
    for(i=0; i<funcBody.length; i++){
        let oldExpr = funcBody[i];
        let newExpr = iterateExpressionsFunctions[oldExpr.type](oldExpr, 0, 'green');
        newFuncBody.push(newExpr);
    }
    blockStatement.body = newFuncBody;

    resFunc = {type: func.type, body: blockStatement, loc: func.loc, expression: func.expression,
        generator: func.generator, id: func.id, params: func.params, async: func.async, range: func.range};
}

function getOppositeColor(color){
    if(color === 'green')
        return 'grey';
    return 'green';
}



function getResFuncBody() {
    let blockStmt = resFunc.body;
    let res =  JSON.parse(JSON.stringify(blockStmt));
    let funcBody = resFunc.body.body;
    let body = [];
    let i;
    for(i=0; i<funcBody.length; i++)
        body.push(resFunc.body.body[i]);
    res.body = body;
    return res;
}

///////////////////////////////////////////////////////////

export {iterateCode, createParamVector, restartFindPath, getResFuncBody, testFunction};