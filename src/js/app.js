import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getExpressions, getValues, restartExpressions} from './ast-handler';

debugger;



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
    // const cell0 = row.insertCell(0);
    // cell0.textContent = exprObj.line;
    // const cell1 = row.insertCell(1);
    // cell1.textContent = exprObj.type;
    // const cell2 = row.insertCell(2);
    // cell2.textContent = exprObj.name;
    // const cell3 = row.insertCell(3);
    // cell3.textContent = exprObj.condition;
    // const cell4 = row.insertCell(4);
    // cell4.textContent = exprObj.value;
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