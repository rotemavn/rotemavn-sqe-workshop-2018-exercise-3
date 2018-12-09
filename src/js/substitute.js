import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
import * as escodegen from 'escodegen';

var inputVector = [];
var varValues = [];
var startOfFunction = -1;
var endOfFunction = -1;
var newExpressions = [];
var originExpressions;


// function varValuesContains(name){
//     var i;
//     for(i=0; i<varValues.length; i++) {
//         if(varValues[i].name === name)
//             return varValues[i].value;
//     }
//     return null;
//
// }




/// Utils
function varValuesSet(name, value, obj){
    var i;
    for(i=0; i<varValues.length; i++) {
        if(varValues[i].name === name) {
            varValues[i].value = value;
            return;
        }
    }
    var newVar = {name: name, value:value, obj:obj};
    varValues.push(newVar);

}

function varValuesGet(ex){
    var i;
    var name = findStringRepresentation(ex);
    for(i=0; i<varValues.length; i++) {
        if(varValues[i].name === name)
            return varValues[i].value;
    }
    return null;

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

function getVarValues(){
    return varValues;
}

function getFuncObj(){
    var i;
    for(i=0; i<originExpressions.length; i++){
        if(originExpressions[i].type === 'FunctionDeclaration'){
            return originExpressions[i].valueObj;
        }
    }
}


function getTextFromVars(){
    var f = getFuncObj();
    var oldBody = f.body;
    oldBody.body = [oldBody.body[0]];
    var newBody = oldBody;
    var newID = f.id;
    newID.name = 'rotem';
    var newFunction = {
        type: f.type,
        body: newBody,
        loc: f.loc,
        expression: f.expression,
        generator: f.generator,
        id: newID,
        params: f.params
    };


    //async: false
    // body: BlockStatement {type: "BlockStatement", body: Array(5), loc: {…}}
    // expression: false
    // generator: false
    // id: Identifier {type: "Identifier", name: "foo", loc: {…}}
    // loc: {start: {…}, end: {…}}
    // params: (3) [Identifier, Identifier, Identifier]
    // type: "FunctionDeclaration"


    // var i, result = '';
    // for(i=0; i<newExpressions.length; i++){
    //     result += escodegen.generate(newExpressions[i]);
    //     result += '\n';
    //
    // }

    // return result;
    return newFunction;
    // return escodegen.generate(newFunction, {
    //     format: {
    //         preserveBlankLines: true
    //     },
    //     sourceCode: code
    // });

}


///////////////////////////////////////////////////////////

function createNewInitVar(ex, paramValues){
    var initVar;
    var paramValuesIndex=0;
    if((ex.line < startOfFunction ||  ex.line > endOfFunction)){
        initVar = {name: ex.name, value: ex.valueObj, obj: ex};
        inputVector.push(initVar);
        varValues.push(initVar);
    }
    else if(ex.line === startOfFunction && ex.type === 'Identifier'){
        initVar = {name: ex.name, value: paramValues[paramValuesIndex], obj: ex};
        paramValuesIndex++;
        inputVector.push(initVar);
        varValues.push(initVar);
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
};

function replaceLiteral(ex){
    var realValue = varValuesGet(ex);
    if(realValue != null){
        return escodegen.generate({
            type: 'Literal',
            value: realValue,
        });
    }
    else
        return ex;
}

function replaceIdentifier(ex){
    var initIdentifier = inputVectorGet(ex);
    if(initIdentifier != null)
        return ex;
    var realValue = varValuesGet(ex);
    if(realValue != null){
        return {type: 'Identifier', name: findStringRepresentation(realValue)};
    }
    else
        return ex;
}

function replaceBinaryExpression(ex){
    var left = replaceExpressionsFunctions[ex.left.type](ex.left);
    var right = replaceExpressionsFunctions[ex.right.type](ex.right);
    var op = ex.operator;
    return {type: 'BinaryExpression', left: left, right:right, operator: op};
}

function replaceReturn(ex){

    return  replaceExpressionsFunctions[ex.argument.type](ex.argument);
}

function replaceExpression(ex){
    if(ex.valueObj !=null  && ex.valueObj !== ''){
        var valObj = ex.valueObj;
        var newValObj = replaceExpressionsFunctions[valObj.type](valObj);
        if(ex.name === '')
            ex.name = findStringRepresentation(ex);
        varValuesSet(ex.name, newValObj, ex);
        return newValObj;
    }


}

function substitute(expressions, paramValues){
    console.log(expressions);
    originExpressions = expressions;
    findFunctionStartAndEnd(expressions);
    createInputVector(expressions, paramValues);
    var i;
    //
    // var func = getFuncObj();
    // var funcBody = func.body.body;
    // var newFuncBody = [];
    // for(i=0; i<funcBody.length; i++){
    //     var oldExpr = funcBody[i];
    //     var newExpr = replaceExpression(oldExpr);
    // }
    //

    for(i=0; i<expressions.length; i++){
        newExpressions[i] = expressions[i];
        if(expressions[i].line > startOfFunction && expressions[i].line < endOfFunction){
            newExpressions.values = replaceExpression(expressions[i]);
        }
    }

    // //TODO : remove print
    console.log('Var values vector = ');
    for(i=0; i<varValues.length; i++)
        console.log(varValues[i]);

    // return newExpressions;




}

///////////////////////////////////////////////////////////

export {substitute, createParamVector, restart, getVarValues, getTextFromVars};