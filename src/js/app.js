import $ from 'jquery';
import {parseCode} from './code-analyzer';
// import {iterateInputCode, createParamVector, getInputVector, getSubstitutedVars} from './substitute-code';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import {substitute, createParamVector, getVarValues, restart, getTextFromVars} from './substitute';
import * as escodegen from "escodegen";


let resultArea = document.getElementById('resultText');


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        restart();
        restartExpressions();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var body = parsedCode.body;
        console.log(body);
        body.forEach(getValues);
        var expressions = getExpressions();

        let inputParams = $('#inputPlaceholder').val();
        var params = createParamVector(inputParams);

        substitute(expressions, params);
        var result = getTextFromVars();
        console.log(result);
        // resultArea.val(result);


        $('#resultText').text(escodegen.generate(result));














        // deleteAllLines();
        // let originCode = $('#codePlaceholder').val();
        // let inputParams = $('#inputPlaceholder').val();
        // let parsedCode = parseCode(originCode);
        // // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        // var body = parsedCode.body;
        // var params = createParamVector(inputParams);
        // iterateInputCode(body, params);
        // var inputVec = getInputVector();
        // console.log('input vector = ' + getInputVector().toString());



        // console.log(JSON.stringify(parsedCode, null, 2));
        // body.forEach(iterateInputCode);
        // var expressions = getExpressions();
        // expressions.forEach(createRow);
        // restartExpressions();
    });
});