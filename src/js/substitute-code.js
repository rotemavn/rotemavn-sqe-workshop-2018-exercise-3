import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';

var substituteFunctions = {
    'VariableDeclaration': subVariableDeclaration,
    'VariableDeclarator': subVariableDeclarator,
    'ReturnStatement': subReturnStatement,
    // 'WhileStatement': subWhileStatement,
    // 'IfStatement': subIfStatement,
};

var evalFunctions = {
    'Literal': evalLiteral,
    'BinaryExpression': evalBinaryExpression,
    'Identifier': evalIdentifier,
};


function restart() {
    inputVector = [];
    inputParams = [];
    inputParamsIndex = 0;
    variablesToSubstitute = [];
}

var inputVector = [];
var inputParams = [];
var inputParamsIndex = 0;
var variablesToSubstitute = [];

function evalLiteral(expr){
    return expr.value;
}

function evalIdentifier(expr){
    var name = findStringRepresentation(expr);
    if(searchValueInInputVector(name) == null){
        return searchValueInLoaclVars(name);
    }
    else{
        return expr;
    }

}

function evalBinaryExpression(expr){
    expr.left = evalFunctions[expr.left.type](expr.left);
    expr.right = evalFunctions[expr.right.type](expr.right);
    return expr;
}

function searchValueInInputVector(varName){
    var i;
    for(i=0; i<inputVector.length; i++){
        if(inputVector[i].name === varName)
            return inputVector[i].value;
    }
    return null;
}

function searchValueInLoaclVars(varName){
    var i;
    for(i=0; i<variablesToSubstitute.length; i++){
        if(variablesToSubstitute[i].name === varName)
            return variablesToSubstitute[i].value;
    }
    return null;
}


function replaceValueInLoaclVars(varName, val){
    var i;
    for(i=0; i<variablesToSubstitute.length; i++){
        if(variablesToSubstitute[i].name === varName) {
            variablesToSubstitute[i].value = val;
            return;
        }
    }
    var pair = {name: varName, value: val};
    variablesToSubstitute.push(pair);

}

function subVariableDeclaration(expr){
    var declarations = expr.declarations;
    declarations.forEach(subVariableDeclarator);
}

function subStmt(expr, value){
    var evaluatedValue = evalFunctions[value.type](value);
    replaceValueInLoaclVars(findStringRepresentation(expr), evaluatedValue);
}

function subVariableDeclarator(expr){
    var value = expr.init;
    subStmt(expr.id, value);
}

function subReturnStatement(expr){
    var value = expr.argument;
    subStmt(value, value);
}




//
//
// function subWhileStatement(expr){
//
// }
//
// function handleAlternate(alt){
//     if (alt.type === 'IfStatement') {
//         var elseIfValues = ['', 'else if statement', '', '', ''];
//         valsIfAlternate(alt, elseIfValues);
//     }
//     else {
//         var elseValues = [alt.loc.start.line, 'else statement', '', '', ''];
//         createExpressionObject(elseValues);
//         iterateInputCode(alt);
//     }
// }


// function subIfStatement(expr){
//     // values[1] = 'If statement';
//     // values[3] = findStringRepresentation(expr);
//     // createExpressionObject(values);
//     //
//     // iterateInputCode(expr.consequent);
//     // if(expr.alternate != null) {
//     //     handleAlternate(expr.alternate);
//     // }
// }

// function subIfAlternate(expr){
//     values[0] = expr.loc.start.line;
//     values[3] = findStringRepresentation(expr);
//     createExpressionObject(values);
//     iterateInputCode(expr.consequent);
//     if(expr.alternate != null) {
//         handleAlternate(expr.alternate);
//     }
// }


function getInitialVarValue(expr){
    // console.log(expr);
    var varEntry = {};
    if(expr.type == 'Identifier'){
        varEntry = {name: findStringRepresentation(expr), value: inputParams[inputParamsIndex]};
        inputParamsIndex += 1;
    }
    else if(expr.type == 'VariableDeclarator'){
        varEntry = {name: findStringRepresentation(expr.id), value: expr.init};
    }
    inputVector.push(varEntry);
}

function performFunctionSubstitution(func){
    var i;
    for(i=0; i<func.length; i++){
        var type = func[i].type;
        substituteFunctions[type](func[i]);
    }

}


function iterateInputCode(code, inputP){
    var i;
    inputParams = inputP;
    for(i=0; i<code.length; i++){
        var expr = code[i];
        if(expr.type === 'FunctionDeclaration'){
            expr.params.forEach(getInitialVarValue);
            performFunctionSubstitution(expr.body.body);
            break;
        }
        else if(expr.type === 'VariableDeclaration'){
            expr.declarations.forEach(getInitialVarValue);
        }
        else if(expr.type === 'VariableDeclarator'){
            getInitialVarValue(expr);
        }
    }
}

function createParamVector(inputP){
    var parsedParams = parseCode(inputP);
    if(parsedParams.body.length === 0)
        return [];
    var inputs = parsedParams.body[0].expression.expressions;
    return inputs;
}

function getInputVector(){
    return inputVector;
}

function getSubstitutedVars(){
    return variablesToSubstitute;
}

export {iterateInputCode};
export {createParamVector};
export {getInputVector};
export {getSubstitutedVars};
export {restart};
