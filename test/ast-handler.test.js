import assert from 'assert';
import * as app from '../src/js/ast-handler';
import {parseCode} from '../src/js/code-analyzer';

describe('Testing App', () => {
    it('Identifier:', () => {
        app.getValues(parseCode('a'));
        var expressions = app.getExpressions();
        assert.equal(expressions.line, 1);
    });

});
