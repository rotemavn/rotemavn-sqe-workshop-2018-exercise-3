import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues} from './ast-handler';

var rowCounter = 1;
let resTable = document.getElementById('resTable');

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


    });
});

export {createNewRow};