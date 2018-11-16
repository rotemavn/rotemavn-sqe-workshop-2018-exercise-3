import {findStringRepresentation} from './strings';

var getValuesFunctions = {'Identifier': valsIdentifier,
    'VariableDeclaration': valsVariableDeclaration,
    'VariableDeclarator': valsVariableDeclarator,
    'ExpressionStatement': valsExpressionStatement,
    'ReturnStatement': valsReturnStatement,
    'FunctionDeclaration': valsFunctionDeclaration,
    'BlockStatement': valsBlockStatement,
    'AssignmentExpression': valsAssignmentExpression,
    'Literal': valsLiteral,
    'BinaryExpression': valsBinaryExpression,
    'WhileStatement': valsWhileStatement,
    'IfStatement': valsIfStatement,
    'ForStatement': valsForStatement,
    'MemberExpression': valsMemberExpression,
    'UnaryExpression': valsUnaryExpression,
    'UpdateExpression': valsUpdateExpression,
    'LogicalExpression': valsLogicalExpression,
    'CallExpression': valsCallExpression,
    'ThisExpression': valsThisExpression,
    'ArrayExpression': valsArrayExpression,
    'SequenceExpression': valsSequenceExpression,
    'ArrowFunctionExpression': valsArrowFunctionExpression,
    'NewExpression': valsNewExpression,
    'ConditionalExpression': valsConditionalExpression
};


var expressions = [];


function getExpressions(){
    return expressions;
}

function restartExpressions() {
    expressions = [];
}


function createExpressionObject(values){
    var expression = {
        line: values[0],
        type: values[1],
        name: values[2],
        condition: values[3],
        value: values[4]

    };
    expressions.push(expression);
}



function valsIdentifier(expr, values){
    values[2] = expr.name;
    createExpressionObject(values);
    
}

function valsVariableDeclaration(expr, values){// eslint-disable-line no-unused-vars
    var declarations = expr.declarations;
    declarations.forEach(getValues);
}

function valsVariableDeclarator(expr, values){
    values[1] = 'Variable declaration';
    values[2] = expr.id.name;
    values[4] = findStringRepresentation(expr.init);
    createExpressionObject(values);
    
}


function valsExpressionStatement(expr, values){// eslint-disable-line no-unused-vars
    var ex = expr.expression;
    getValues(ex);
}

function valsReturnStatement(expr, values){
    values[1] = 'Return statement';
    values[4] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}

function valsFunctionDeclaration(expr, values){
    values[1] = 'Function declaration';
    values[2] = expr.id.name;
    createExpressionObject(values);
    

    var params = expr.params;
    getValues(params);
    var body = expr.body;
    getValues(body);
}
function valsBlockStatement(expr, values){// eslint-disable-line no-unused-vars
    var body = expr.body;
    getValues(body);
}
function valsAssignmentExpression(expr, values){
    values[1] = 'Assignment expression';
    values[2] = findStringRepresentation(expr.left);
    values[4] = findStringRepresentation(expr.right);
    createExpressionObject(values);
    
}
function valsLiteral(expr, values){
    values[4] = expr.value;
    createExpressionObject(values);
    
}
function valsBinaryExpression(expr, values){
    values[1] = 'Binary expression';
    values[4] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}
function valsWhileStatement(expr, values){
    values[1] = 'While statement';
    values[3] = findStringRepresentation(expr);
    createExpressionObject(values);
    
    getValues(expr.body);
}
function valsIfStatement(expr, values){
    values[1] = 'If statement';
    values[3] = findStringRepresentation(expr);
    createExpressionObject(values);
    
    getValues(expr.consequent);
    getValues(expr.alternate);
}
function valsMemberExpression(expr, values){
    values[1] = 'Member expression';
    values[2] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}
function valsUnaryExpression(expr, values){
    values[1] = 'Unary expression';
    values[4] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}

function valsForStatement(expr, values){
    values[1] = 'For statement';
    values[3] = findStringRepresentation(expr);
    createExpressionObject(values);
    
    getValues(expr.body);

}

function valsUpdateExpression(expr, values){
    values[1] = 'Update expression';
    values[4] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}

function valsLogicalExpression(expr, values){
    values[1] = 'Logical expression';
    values[4] = findStringRepresentation(expr);
    createExpressionObject(values);
    
}

function valsCallExpression(exprs, values){
    values[1] = 'Call expression';
    values[4] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsThisExpression(exprs, values){
    values[1] = 'This expression';
    values[2] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsArrayExpression(exprs, values){
    values[1] = 'Array expression';
    values[4] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsSequenceExpression(exprs, values){
    values[1] = 'Sequence expression';
    values[4] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsArrowFunctionExpression(exprs, values){
    values[1] = 'Arrow Function expression';
    values[4] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsNewExpression(exprs, values){
    values[1] = 'New expression';
    values[4] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}

function valsConditionalExpression(exprs, values){
    values[1] = 'Conditional expression';
    values[3] = findStringRepresentation(exprs);
    createExpressionObject(values);
    
}
function getValues(expr){
    if(expr != null) {
        if (expr.constructor === Array){
            expr.forEach(getValues);
        }
        else {
            var values = ['', '', '', '', ''];
            values[0] = expr.loc.start.line;
            var type = expr.type;
            values[1] = type;
            getValuesFunctions[type](expr, values);
        }
    }
}
export {getValues};
export {getExpressions};
export {createExpressionObject};
export {restartExpressions};