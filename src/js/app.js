import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getValues, getExpressions, restartExpressions} from './ast-handler';
import * as bl from './substitute';

// function evaluate(exp){
//     try{
//         if(exp.length === undefined)
//             exp = [exp];
//         var i;
//         var str = '';
//         for(i=0; i<exp.length; i++){
//             var res = evalString(exp[i]);
//             str += res;
//         }
//         return str;
//     }
//     catch (e) {
//         return escodegen.generate(exp);
//     }
// }
//
// function createOutput(exp){
//     if(exp === undefined || exp == null)
//         return '';
//     var html = '';
//     if(exp.type !== 'IfStatement'){
//         html = html + '&emsp;' + evaluate(exp) + '<br>';
//         return html;
//     }
//     else{
//         var test = exp.test;
//         var evalTest = '(' + evaluate(test) + ')';
//         html = html + '<em style="color:' + test.color + '">if' + evalTest + '</em><br>';
//         // html = html + '<em style="color:' + test.color + '">if(' + evaluate(test) + ')</em><br>';
//         var consenquent = exp.consequent.body;
//         html = html + '{<br>&emsp;' + evaluate(consenquent) + '<br>}';
//         if(exp.alternate !== undefined) {
//             var altRes = createOutput(exp.alternate);
//             // if(altRes.indexOf('if') > 2){
//             //     altRes = '{<br>' + altRes.substring(altRes.indexOf('{')+1, altRes.indexOf('}')) + '}';
//             // }
//             // // altRes = altRes.substring(altRes.indexOf('{')+1, altRes.indexOf('}')-1);
//             return html + '<br>else ' + altRes + '<br>';
//         }
//         else
//             return html;
//     }
//
// }
//
//
// function colorOutput(func){
//     var funcBody = func.body.body;
//     var i;
//     var params = '(';
//     for(i=0; i<func.params.length; i++){
//         if(i>0)
//             params += ', ' + func.params[i].name;
//         else
//             params += func.params[i].name;
//     }
//     params += ')';
//
//     var html = 'function '+func.id.name + params + '{<br>';
//     for(i=0; i<funcBody.length; i++){
//         var exp = funcBody[i];
//         html = html + createOutput(exp);
//
//     }
//
//     html += '<br>}';
//     $('#resultText').html(html);
// }


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        bl.restart();
        restartExpressions();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var body = parsedCode.body;
        console.log(body);
        body.forEach(getValues);
        var expressions = getExpressions();
        let inputParams = $('#inputPlaceholder').val();
        var params = bl.createParamVector(inputParams);
        bl.substitute(expressions, params, body);
        var html = bl.getFuncHTML();
        console.log(html);
        $('#resultText').html(html);

    });
});