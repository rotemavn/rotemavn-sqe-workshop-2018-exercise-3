// import assert from 'assert';
// import * as ast_handler from '../src/js/ast-handler';
// import * as bl from '../src/js/substitute';
// import {parseCode} from '../src/js/code-analyzer';
//
//
// function before(code, inputParams){
//     bl.restart();
//     ast_handler.restartExpressions();
//     var parsedCode = parseCode(code).body;
//     ast_handler.getValues(parsedCode);
//     var expressions = ast_handler.getExpressions();
//     var params = bl.createParamVector(inputParams);
//     bl.substitute(expressions, params);
// }
//
// const nonRelevantKeys = ['range', 'loc', '0', '1', 'line', 'start', 'end', 'col'];
//
//
// function compareObjects(expected, actual){
//     console.log('#######################');
//     console.log('lengths = ' + expected.length);
//     var i, j, key, ex, ac;
//     if(expected.length !== undefined){
//         for(i=0; i<expected.length; i++){
//             const keys = Object.keys(expected[i]);
//             for(j=0; j<keys.length; j++){
//                 key = keys[j];
//                 if(!nonRelevantKeys.includes(key)){
//                     console.log('key: '+ key);
//                     ex = expected[i][key];
//                     ac = actual[i][key];
//                     compare(ex, ac);
//                 }
//
//             }
//         }
//     }
//     else {
//         // compare(expected.type, actual.type);
//         // compare(expected.value, actual.value);
//         // compare(expected.name, actual.name);
//         // compare(expected.left, actual.left);
//         // compare(expected.right, actual.right);
//         // compare(expected.operator, actual.operator);
//
//         const keys = Object.keys(actual);
//         for (j = 0; j < keys.length; j++) {
//             key = keys[j];
//             if (!nonRelevantKeys.includes(key)) {
//                 console.log('key: ' + key);
//                 ex = expected[key];
//                 ac = actual[key];
//                 compare(ex, ac);
//             }
//
//         }
//     }
//
//     console.log('#DONE');
// }
//
// function compare(expected, actual){
//     console.log('$$$ comparing :: expected = ' + expected + ' VS. actual = ' + actual);
//     try {
//         if (typeof(expected) === 'object' && typeof(actual) === 'object')
//             compareObjects(expected, actual);
//         else
//             assert.equal(expected, actual);
//     }
//     catch (e) {
//         assert.fail('One of compared object is undefined');
//
//     }
//
// }
//
//
// function compareExpectedToOutput(expected, actual){
//     console.log('expected = ');
//     console.log(expected);
//     console.log('actual = ');
//     console.log(actual);
//
//     var i;
//     for(i=0; i<expected.length; i++) {
//         const keys = Object.keys(expected[i]);
//         var j;
//         for(j=0; j<keys.length; j++){
//             var key = keys[j];
//             var ex = expected[i][key];
//             var ac = actual[i][key];
//             compare(ex, ac);
//         }
//     }
// }
//
//
// describe('Testing Substitute', () => {
//     it('Binary expression:', () => {
//         var testText = 'function f(x,y){\n' +
//             'let a=x+y;\n' +
//             'return a;\n' +
//             '}';
//         var resultFunc = 'function f(x,y){\n' +
//             'return x+y;\n' +
//             '}';
//
//         before(testText, '');
//         var expected = parseCode(resultFunc).body;
//         var actual = [bl.getFuncObj(ast_handler.getExpressions())];
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
// describe('Testing Substitute', () => {
//     it('While Statement:', () => {
//         var testText = 'function f(x,y){\n let a=x+y;\n while(a<10){\na=a+1;\n}}';
//         var resultFunc = 'function f(x,y){\n' +
//             'while(x+y<10){\n' +
//             '}\n' +
//             '}';
//
//         before(testText, '');
//         var expected = parseCode(resultFunc).body;
//         var actual = [bl.getFuncObj(ast_handler.getExpressions())];
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
// describe('Testing Substitute', () => {
//     it('Assignment:', () => {
//         var testText = 'let a=2;\n' +
//             'function f(x){\n' +
//             'let y=a;\n' +
//             'y=y+1;\n' +
//             'return y;\n' +
//             '}';
//         var resultFunc = 'function f(x){\n' +
//             'return a+1;\n' +
//             '}';
//
//         before(testText, '');
//         var expected = parseCode(resultFunc).body;
//         var actual = [bl.getFuncObj(ast_handler.getExpressions())];
//         compareExpectedToOutput(expected, actual);
//     });
// });
