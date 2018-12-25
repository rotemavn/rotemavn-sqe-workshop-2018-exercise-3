import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import {createFlowChart, restartGraphCreation} from './graph_creation';
import {getResFuncBody, iterateCode, createParamVector, restartFindPath, testFunction} from './find-path';

function restart(){
    restartFindPath();
    restartGraphCreation();
    restartExpressions();
}


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        // let ret = testFunction('createParamVector', ['1']);
        restart();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var body = parsedCode.body;
        body.forEach(getValues);
        var expressions = getExpressions();
        let inputParams = $('#inputPlaceholder').val();
        var params = createParamVector(inputParams);
        iterateCode(expressions, params, body);
        var onlyBody = getResFuncBody();
        var graph = createFlowChart(onlyBody);
        $('#graph').html(graph);
    });
});