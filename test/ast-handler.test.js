import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import {parseCode} from '../src/js/code-analyzer';

// describe('Testing ast-handler', () => {
//     it('createExpressionObject:', () => {
//         ast_handler.createExpressionObject(['1', 'Test', '', '', '']);
//         var expected = {line:'1', type:'Test', name:'', condition:'', value:''};
//         var actual = ast_handler.getExpressions()[0];
//         for(var key in expected){
//             assert.equal(expected[key], actual[key]);
//         }
//     });
// });

// describe('Testing ast-handler', () => {
//     it('valsIdentifier:', () => {
//         var program = parseCode('a').body;
//         ast_handler.getValues(program);
//         var expected = {line:'1', type:'Identifier', name:'a', condition:'', value:''};
//         var actual = ast_handler.getExpressions()[0];
//         for(var key in expected){
//             assert.equal(expected[key], actual[key]);
//         }
//     });
// });
// describe('Testing ast-handler', () => {
//     it('valsReturnStatement:', () => {
//         var program = parseCode('function x(){return 2;}').body;
//         ast_handler.getValues(program);
//         var expected = [{line:'1', type:'Function declaration', name:'x', condition:'', value:''},{line:'1', type:'Return statement', name:'', condition:'', value:'2'}];
//         var actual = ast_handler.getExpressions();
//         var i;
//         for(i=0; i<expected.length; i++) {
//             for (var key in expected[i]) {
//                 assert.equal(expected[i][key], actual[i][key]);
//             }
//         }
//     });
// });
describe('Testing ast-handler', () => {
    it('valsFunctionDeclaration:', () => {
        var program = parseCode('function x1(){}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Function declaration', name:'x1', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});


