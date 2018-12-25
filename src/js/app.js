import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import {createFlowChart, restartGraphCreation} from './graph_creation';
import {getResFuncBody, iterateCode, createParamVector, restartFindPath} from './find-path';
const Viz = require('viz.js');

function restart(){
    restartFindPath();
    restartGraphCreation();
    restartExpressions();
}


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        restart();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let body = parsedCode.body;
        body.forEach(getValues);
        let expressions = getExpressions();
        let inputParams = $('#inputPlaceholder').val();
        let params = createParamVector(inputParams);
        iterateCode(expressions, params, body);
        let onlyBody = getResFuncBody();
        let graphText = createFlowChart(onlyBody);
        let graph =  Viz('digraph {' + graphText + '}');
        $('#graph').html(graph);
    });
});