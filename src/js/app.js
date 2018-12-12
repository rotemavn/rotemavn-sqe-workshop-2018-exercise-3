import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import * as bl from './substitute';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        bl.restart();
        restartExpressions();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var body = parsedCode.body;
        body.forEach(getValues);
        var expressions = getExpressions();
        let inputParams = $('#inputPlaceholder').val();
        var params = bl.createParamVector(inputParams);
        bl.substitute(expressions, params, body);
        var html = bl.getFuncHTML();
        $('#resultText').html(html);

    });
});