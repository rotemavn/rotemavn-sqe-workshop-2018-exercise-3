// import assert from 'assert';
// import * as sub_code from '../src/js/substitute-code';
// import {parseCode} from '../src/js/code-analyzer';
//
// function before(code, inputParams){
//     sub_code.restart();
//     var program = parseCode(code).body;
//     var params = sub_code.createParamVector(inputParams);
//     sub_code.iterateInputCode(program, params);
// }
//
// function compareExpectedToOutput(expected, actual){
//     console.log('@@@@@@@@@@@');
//     console.log('Test');
//     console.log('expected = '+JSON.stringify(expected,null,2));
//     console.log('actual = '+JSON.stringify(actual,null,2));
//     var i;
//     for(i=0; i<expected.length; i++) {
//         console.log('expected[i] = '+JSON.stringify(expected[i],null,2));
//         console.log('actual[i] = '+JSON.stringify(actual[i],null,2));
//         const keys = Object.keys(expected[i]);
//         for (var key in keys) {
//             console.log('key = ' + key.toString());
//             console.log('expected[i][name] = '+JSON.stringify(expected[i][key.toString()],null,2) );
//             console.log(' actual[i][name] = '+ actual[i][key.toString()]);
//             assert.equal(expected[i]['name'], actual[i]['name']);
//         }
//     }
// }
//
// function createLiteral(val){
//     return {type:'Literal', value: val};
// }
//
//
// describe('Testing substitute-code', () => {
//     it('test input vector 1:', () => {
//         // sub_code.restart();
//         before('let x=1;', '');
//         var expected = [{name:'x', value:1}];
//         var actual = sub_code.getInputVector();
//         compareExpectedToOutput(expected, actual);
//     });
// });
//
// //
// // describe('Testing substitute-code', () => {
// //     it('test input vector 2:', () => {
// //         sub_code.restart();
// //         before('let x=1;const t=true;', '');
// //         var expected = [{name:'x', value:createLiteral(1)}, {name:'t', value:createLiteral(true)}];
// //         var actual = sub_code.getInputVector();
// //         compareExpectedToOutput(expected, actual);
// //     });
// // });
// //
// // describe('Testing substitute-code', () => {
// //     it('test input vector 3:', () => {
// //         sub_code.restart();
// //         before('let x=1;const t=true;let z=[1,2,3]', '');
// //         var expected = [{name:'x', value:createLiteral(1)}, {name:'t', value:createLiteral(true)},
// //             {name:'z', value:createLiteral([1,2,3])}];
// //         var actual = sub_code.getInputVector();
// //         compareExpectedToOutput(expected, actual);
// //     });
// // });
// //
// // describe('Testing substitute-code', () => {
// //     it('test input vector 4:', () => {
// //         sub_code.restart();
// //         before('let x=1;function f(a,b){return a;}', '"a","b"');
// //         var expected = [{name:'x', value:createLiteral(1)}, {name:'a', value:createLiteral('a')},
// //             {name:'b', value:createLiteral('c')}];
// //         var actual = sub_code.getInputVector();
// //         compareExpectedToOutput(expected, actual);
// //     });
// // });
//
//
//
//
//
//
