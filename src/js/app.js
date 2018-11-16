import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getExpressions, getValues, restartExpressions} from './ast-handler';

var rowCounter = 1;
let resTable = document.getElementById('resTable');


function createRow(exprObj){
    const row = resTable.insertRow(rowCounter);
    rowCounter++;
    var index = 0;
    for(var key in exprObj){
        const cell = row.insertCell(index);
        index++;
        cell.textContent = exprObj[key];
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
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

        var body = parsedCode.body;
        body.forEach(getValues);
        var expressions = getExpressions();
        expressions.forEach(createRow);
        restartExpressions();
    });
});