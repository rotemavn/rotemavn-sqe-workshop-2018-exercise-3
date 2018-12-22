import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import * as bl from './substitute';
import {createFlowChart, createGraph} from './graph_creation';
import {getOnlyBodyNoReturn, iterateCode, getResFunc, createParamVector, getFuncHTML} from './find-path';
import * as escodegen from 'escodegen';

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
        var params = createParamVector(inputParams);
        iterateCode(expressions, params, body);

        //
        // var html = getFuncHTML();
        // $('#resultText1').html(html);

        var resFunc = getResFunc();
        var onlyBody = getOnlyBodyNoReturn(resFunc);
        var graph = createFlowChart(onlyBody);
        // var graph = createGraph(onlyBody, escodegen.generate(onlyBody));
        $('#graph').html(graph);


    });
});