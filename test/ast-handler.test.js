import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import {parseCode} from '../src/js/code-analyzer';

describe('Testing ast-handler', () => {
    it('createExpressionObject:', () => {
        ast_handler.createExpressionObject(['1', 'Test', '', '', '']);
    });

});
//
// describe('Testing App', () => {
//     it('Identifier:', () => {
//         ast_handler.getValues(parseCode('a'));
//         var expressions = ast_handler.getExpressions();
//         assert.equal(expressions.line, 1);
//     });
//
// });
