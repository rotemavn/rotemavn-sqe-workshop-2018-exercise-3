// import assert from 'assert';
// import {parseCode} from '../src/js/code-analyzer';
// // var codeAnalyzer = require('../src/js/code-analyzer');
// describe('The javascript parser', () => {
//     it('is parsing an empty function correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('')),
//             '{"type":"Program","body":[],"sourceType":"script","range":[0,0],"loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
//         );
//     });
//
//     it('is parsing a simple variable declaration correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let a = 1;')),
//             '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","range":[4,5],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","range":[8,9],"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"range":[4,9],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","range":[0,10],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","range":[0,10],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
//         );
//     });
// });