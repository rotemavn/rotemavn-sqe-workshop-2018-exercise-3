var getStringsFunctions = {'Identifier': sName,
    'FunctionDeclaration': sName,
    'WhileStatement': sTest,
    'IfStatement': sTest,
    'VariableDeclarator': sVariableDeclarator,
    'ReturnStatement': sReturnStatement,
    'AssignmentExpression': sAssignmentExpression,
    'Literal': sLiteral,
    'BinaryExpression': sBinaryExpression,
    'MemberExpression': sMemberExpression,
    'UnaryExpression': sUnaryExpression,
    'VariableDeclaration': sDoNothing,
    'BlockStatement': sDoNothing,
    'ExpressionStatement': sDoNothing
};


function sName(expr){
    return expr.name;
}

function sVariableDeclarator(expr){// eslint-disable-line no-unused-vars
    return expr.id.name;
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
    return findStringRepresentation(expr.object) +'['+ findStringRepresentation(expr.property)+']';
}
function sUnaryExpression(expr){
    return expr.operator + findStringRepresentation(expr.argument);
}


function findStringRepresentation(expr){
    var type = expr.type;
    return getStringsFunctions[type](expr);
}

export{findStringRepresentation};