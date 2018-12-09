import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import * as bl from '../src/js/substitute';
import {parseCode} from '../src/js/code-analyzer';


function before(code, inputParams){
    bl.restart();
    ast_handler.restartExpressions();
    var parsedCode = parseCode(code).body;
    var body = parsedCode.body;
    body.forEach(ast_handler.getValues);
    var expressions = ast_handler.getExpressions();
    var params = bl.createParamVector(inputParams);
    bl.substitute(expressions, params);
}

function compareExpectedToOutput(expected, actual){
    var i;
    for(i=0; i<expected.length; i++) {
        const keys = Object.keys(expected[i]);
        for (var key in keys) {
            assert.equal(expected[i][key], actual[i][key]);
        }
    }
}


describe('Testing ast-handler', () => {
    it('null test:', () => {
        ast_handler.restartExpressions();
        ast_handler.createExpressionObject(['1', 'Test', '', '', '']);
        var expected = [{line:'1', type:'Test', name:'', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
        bl.restart();
    });
});

describe('Testing ast-handler', () => {
    it('createExpressionObject:', () => {
        ast_handler.restartExpressions();
        ast_handler.createExpressionObject(['1', 'Test', '', '', '']);
        var expected = [{line:'1', type:'Test', name:'', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsIdentifier:', () => {
        before('a');
        var expected = [{line:'1', type:'Identifier', name:'a', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);

    });
});
describe('Testing ast-handler', () => {
    it('valsReturnStatement:', () => {
        before('function x(){return 2;}');
        var expected = [{line:'1', type:'FunctionDeclaration', name:'x', condition:'', value:''},{line:'1', type:'ReturnStatement', name:'', condition:'', value:'2'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsFunctionDeclaration:', () => {
        before('function x1(){}');
        var expected = [{line:'1', type:'FunctionDeclaration', name:'x1', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsVariableDeclaration:', () => {
        before('var x=1;');
        var expected = [{line:'1', type:'VariableDeclaration', name:'x', condition:'', value:'1'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});