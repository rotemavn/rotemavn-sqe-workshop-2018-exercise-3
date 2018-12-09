// import assert from 'assert';
// import * as sub_code from '../src/js/substitute';
// import {parseCode} from '../src/js/code-analyzer';
// import {getExpressions, getValues, restartExpressions} from '../src/js/ast-handler';
//
// function before(code, inputParams){
//     sub_code.restart();
//     restartExpressions();
//     var program = parseCode(code).body;
//     var params = sub_code.createParamVector(inputParams);
//     program.forEach(getValues);
//     var expressions = getExpressions();
//     console.log(expressions);
//     sub_code.substitute(expressions, params);
// }
//
//
// function compare(expected, actual){
//     if (typeof(expected) === 'object' && typeof(actual) === 'object')
//         compareObjects(expected, actual);
//     else
//         assert.equal(expected, actual);
//
// }
//
// function compareObjects(expected, actual){
//     console.log('#######################');
//     // console.log('expected.type = '+ expected.type + '  actual.type = ' +  actual.type);
//     // console.log('expected.value = '+ expected.value + '  actual.value = ' +  actual.value);
//
//
//     compare(expected.type, actual.type);
//     compare(expected.value, actual.value);
//     compare(expected.name, actual.name);
//     compare(expected.left, actual.left);
//     compare(expected.right, actual.right);
//     compare(expected.operator, actual.operator);
//     console.log('#DONE');
// }
//
// function compareExpectedToOutput(expected, actual){
//     console.log('@@@@@@@@@@@');
//     console.log('Test');
//     // console.log('expected = '+JSON.stringify(expected,null,2));
//     console.log('actual = '+JSON.stringify(actual,null,2));
//     var i;
//     for(i=0; i<actual.length; i++) {
//         // console.log('expected[i] = '+JSON.stringify(expected[i],null,2));
//         // console.log('actual[i] = '+JSON.stringify(actual[i],null,2));
//         const keys = Object.keys(actual[i]);
//         // console.log('keys = ' + keys);
//         var j;
//         for(j=0; j<keys.length; j++){
//             var key = keys[j];
//             if(key !== 'obj') {
//                 // console.log('key = ' + key);
//                 console.log('i = ' + i + ' expected[i][key] = ' + expected[i][key]);
//                 console.log('i = ' + i + ' actual[i][key] = ' + actual[i][key]);
//
//                 var ex = expected[i][key];
//                 var ac = actual[i][key];
//                 // if (typeof(ex) === 'object' && typeof(ac) === 'object')
//                 //     compareObjects(ex, ac);
//                 // else
//                 //     assert.equal(ex, ac);
//                 compare(ex, ac);
//             }
//         }
//     }
// }
//
//
// describe('Testing substitute', () => {
//     it('test input vector 1:', () => {
//         before('let x=1;', '');
//         var expected = [{name:'x', value:{type: 'Literal',value: 1}}];
//         var actual = sub_code.getVarValues();
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
//
// describe('Testing substitute-code', () => {
//     it('test input vector 2:', () => {
//         before('let x=1;const t=true;', '');
//         var expected = [{name:'x', value:{type: 'Literal',value: 1}}, {name:'t', value:{type: 'Literal',value: true}}];
//         var actual = sub_code.getVarValues();
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
// describe('Testing substitute-code', () => {
//     it('test no substitution:', () => {
//         before('let x=1;\nfunction f(){\nlet v=x;\n}', '');
//         var expected = [{name:'x', value:{type: 'Literal',value: 1}}, {name:'v', value:{type: 'Identifier',name: 'x'}}];
//         var actual = sub_code.getVarValues();
//         compareExpectedToOutput(expected, actual);
//     });
// });
// //
// describe('Testing substitute-code', () => {
//     it('test simple substitution:', () => {
//         before('let x=1;\nfunction f(){\nlet v=x;\nlet y=v;\n}', '');
//         var expected = [{name:'x', value:{type: 'Literal',value: 1}}, {name:'v', value:{type: 'Identifier',name: 'x'}},
//             {name:'y', value:{type: 'Identifier',name: 'x'}}];
//         var actual = sub_code.getVarValues();
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
// describe('Testing substitute-code', () => {
//     it('test binary operator:', () => {
//         before('let x=1;\nlet y=2;\nfunction f(){\nlet v=x;\nlet z=y;\nlet res=v+z;\n}', '');
//         var expected = [{name:'x', value:{type: 'Literal',value: 1}},
//             {name:'y', value:{type: 'Literal',value: 2}},
//             {name:'v', value:{type: 'Identifier',name: 'x'}},
//             {name:'z', value:{type: 'Identifier',name: 'y'}},
//             {name:'res', value:{type: 'BinaryExpression',operator: '+',
//                 left: {type: 'Identifier', name: 'x'}, right: {type: 'Identifier',name: 'y'}
//             }},
//         ];
//         var actual = sub_code.getVarValues();
//         compareExpectedToOutput(expected, actual);
//     });
// });
