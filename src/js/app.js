import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {findStringRepresentation} from './strings';
debugger;

var rowCounter = 1;
let resTable = document.getElementById('resTable');
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
};



// The function takes an array of table values.
// The function creates a new row at the result table and sets the values.
function createNewRow(values){
    const row = resTable.insertRow(rowCounter);
    rowCounter++;
    let i;
    for(i=0; i<5; i++){
        const cell = row.insertCell(i);
        cell.textContent = values[i];
    }
}


function valsIdentifier(expr, values){
    values[2] = expr.name;
    createNewRow(values);
}

function valsVariableDeclaration(expr, values){// eslint-disable-line no-unused-vars
    var declarations = expr.declarations;
    declarations.forEach(getValues);
}

function valsVariableDeclarator(expr, values){
    values[1] = 'Variable declaration';
    values[2] = expr.id.name;
    values[4] = findStringRepresentation(expr.init);
    createNewRow(values);
}


function valsExpressionStatement(expr, values){// eslint-disable-line no-unused-vars
    var ex = expr.expression;
    getValues(ex);
}

function valsReturnStatement(expr, values){
    values[1] = 'Return statement';
    values[4] = findStringRepresentation(expr);
    createNewRow(values);
}

function valsFunctionDeclaration(expr, values){
    values[1] = 'Function declaration';
    values[2] = expr.id.name;
    createNewRow(values);

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
    createNewRow(values);
}
function valsLiteral(expr, values){
    createNewRow(values);
}
function valsBinaryExpression(expr, values){
    createNewRow(values);
}
function valsWhileStatement(expr, values){
    values[1] = 'While statement';
    values[3] = findStringRepresentation(expr);
    createNewRow(values);
    getValues(expr.body);
}
function valsIfStatement(expr, values){
    values[1] = 'If statement';
    values[3] = findStringRepresentation(expr);
    createNewRow(values);
    getValues(expr.consequent);
    getValues(expr.alternate);
}
function valsMemberExpression(expr, values){
    values[2] = findStringRepresentation(expr);
    createNewRow(values);
}
function valsUnaryExpression(expr, values){
    createNewRow(values);
}

function valsForStatement(expr, values){
    values[1] = 'For statement'; //TODO: Complete the parsing of for itself
    createNewRow(values);
    getValues(expr.body);

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


// The function clears the result table from previous tests
function deleteAllLines(){

    var tableRows = resTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    while(rowCount > 1){
        resTable.deleteRow(rowCount - 1);
        rowCount--;
    }

    rowCounter = 1;
}


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        deleteAllLines();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 1));

        var body = parsedCode.body;
        body.forEach(getValues);


    });
});
