var getStringsFunctions = {'Identifier': sName,
    'FunctionDeclaration': sIDName,
    'WhileStatement': sTest,
    'IfStatement': sTest,
    'VariableDeclarator': sVariableDeclarator,
    'ReturnStatement': sReturnStatement,
    'AssignmentExpression': sAssignmentExpression,
    'Literal': sLiteral,
    'BinaryExpression': sBinaryExpression,
    'MemberExpression': sMemberExpression,
    'UnaryExpression': sUnaryExpression,
    'ForStatement': sForStatement,
    'UpdateExpression': sUpdateExpression,
    'VariableDeclaration': sVariableDeclaration,
    'LogicalExpression': sLogicalExpression,
    'CallExpression': sCallExpression,
    'ThisExpression': sThisExpression,
    'ArrayExpression': sArrayExpression,
    'SequenceExpression': sSequenceExpression,
    // 'ArrowFunctionExpression': sArrowFunctionExpression,
    // 'NewExpression': sNewExpression,
    'ConditionalExpression': sConditionalExpression,
    'BlockStatement': sDoNothing,
    'ExpressionStatement': sDoNothing
};

function sName(expr){
    return expr.name;
}

function sIDName(expr){
    return expr.id.name;
}

function sVariableDeclarator(expr){
    if(expr.init == null || expr.init === undefined){
        return expr.id.name;
    }
    else {
        return expr.id.name + '=' + findStringRepresentation(expr.init);
    }
}

function sDoNothing(expr){ // eslint-disable-line no-unused-vars
    return '';
}

function sReturnStatement(expr){
    return findStringRepresentation(expr.argument);
}

function sAssignmentExpression(expr){
    return findStringRepresentation(expr.left) + expr.operator + findStringRepresentation(expr.right);
}
function sLiteral(expr){
    return expr.value;
}
function sBinaryExpression(expr){
    return findStringRepresentation(expr.left) + expr.operator + findStringRepresentation(expr.right);
}
function sTest(expr){
    return findStringRepresentation(expr.test);
}

function sMemberExpression(expr){
    if(expr.computed){
        return findStringRepresentation(expr.object) +'['+ findStringRepresentation(expr.property)+']';
    }
    else
        return findStringRepresentation(expr.object) +'.'+ findStringRepresentation(expr.property);
}
function sUnaryExpression(expr){
    return expr.operator + findStringRepresentation(expr.argument);
}

function sForStatement(expr){
    return findStringRepresentation(expr.init) + '; ' + findStringRepresentation(expr.test) + '; ' + findStringRepresentation(expr.update);
}

function sUpdateExpression(expr){
    if (expr.prefix){
        return  expr.operator + findStringRepresentation(expr.argument);
    }
    else {
        return findStringRepresentation(expr.argument) + expr.operator;
    }
}

function sVariableDeclaration(expr){
    var s = '';
    var i;
    for(i=0; i<expr.declarations.length; i++){
        s += findStringRepresentation(expr.declarations[i]);
    }
    return s;
}

function sLogicalExpression(expr){
    return findStringRepresentation(expr.left) + ' ' + expr.operator +  ' ' + findStringRepresentation(expr.right);
}

function sCallExpression(expr){
    var args = '', i;
    for(i=0; i<expr.arguments.length - 1; i++){
        args += findStringRepresentation(expr.arguments[i]) + ', ';
    }
    args += findStringRepresentation(expr.arguments[i]);
    return findStringRepresentation(expr.callee) + '(' + args + ')';
}

function sThisExpression(expr){// eslint-disable-line no-unused-vars
    return 'this';
}

function sArrayExpression(expr){
    var elements = '', i;
    for(i=0; i<expr.elements.length - 1; i++){
        elements += findStringRepresentation(expr.elements[i]) + ', ';
    }
    elements += findStringRepresentation(expr.elements[i]);
    return '[' + elements + ']';
}


function sSequenceExpression(expr){
    var elements = '', i;
    for(i=0; i<expr.expressions.length - 1; i++){
        elements += findStringRepresentation(expr.expressions[i]) + ', ';
    }
    elements += findStringRepresentation(expr.expressions[i]);
    return '{' + elements + '}';
}

// function sArrowFunctionExpression(expr){
//     var params = '', i;
//     for(i=0; i<expr.params.length - 1; i++){
//         params += findStringRepresentation(expr.params[i]) + ', ';
//     }
//     params += findStringRepresentation(expr.params[i]);
//     return findStringRepresentation(expr.id) + '(' + params + ') => {' + findStringRepresentation(expr.body)+'}';
// }
//
// function sNewExpression(expr){
//     return sCallExpression(expr);
// }

function sConditionalExpression(expr){
    return findStringRepresentation(expr.test) + ' ? ' + findStringRepresentation(expr.consequent) + ' : ' + findStringRepresentation(expr.alternate);
}

function findStringRepresentation(expr){
    try {
        // console.log('expr.type =' + expr.type);
        var type = expr.type;
        return getStringsFunctions[type](expr);
    }
    catch (e) {
        if(expr.type === 'ReturnStatement')
            return expr.value;
        return '';
    }
}

export{findStringRepresentation};