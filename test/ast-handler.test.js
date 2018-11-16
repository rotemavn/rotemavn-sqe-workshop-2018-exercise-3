import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import {parseCode} from '../src/js/code-analyzer';


function before(code){
    ast_handler.restartExpressions();
    var program = parseCode(code).body;
    ast_handler.getValues(program);
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
        var expected = [{line:'1', type:'Function declaration', name:'x', condition:'', value:''},{line:'1', type:'Return statement', name:'', condition:'', value:'2'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsFunctionDeclaration:', () => {
        before('function x1(){}');
        var expected = [{line:'1', type:'Function declaration', name:'x1', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsVariableDeclaration:', () => {
        before('var x=1;');
        var expected = [{line:'1', type:'Variable declaration', name:'x', condition:'', value:'1'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsAssignmentExpression:', () => {
        before('x=1;');
        var expected = [{line:'1', type:'Assignment expression', name:'x', condition:'', value:'1'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsLiteral:', () => {
        before('5');
        var expected = [{line:'1', type:'Literal', name:'', condition:'', value:'5'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsBinaryExpression:', () => {
        before('x+y;');
        var expected = [{line:'1', type:'Binary expression', name:'', condition:'', value:'x+y'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsWhileStatement:', () => {
        before('while(x!=0){x--;}');
        var expected = [{line:'1', type:'While statement', name:'', condition:'x!=0', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsIfStatement:', () => {
        before('if(x!=0){x--;}');
        var expected = [{line:'1', type:'If statement', name:'', condition:'x!=0', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});


describe('Testing ast-handler', () => {
    it('valsMemberExpression:', () => {
        before('x[1];');
        var expected = [{line:'1', type:'Member expression', name:'x[1]', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsUnaryExpression:', () => {
        before('-3;');
        var expected = [{line:'1', type:'Unary expression', name:'', condition:'', value:'-3'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsForStatement:', () => {
        before('for(i=0;i<1;i++){}');
        var expected = [{line:'1', type:'For statement', name:'', condition:'i=0; i<1; i++', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsUpdateExpression:', () => {
        before('i++');
        var expected = [{line:'1', type:'Update expression', name:'', condition:'', value:'i++'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsLogicalExpression:', () => {
        before('x&&y');
        var expected = [{line:'1', type:'Logical expression', name:'', condition:'', value:'x && y'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsCallExpression:', () => {
        before('update(x,y);');
        var expected = [{line:'1', type:'Call expression', name:'', condition:'', value:'update(x, y)'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsThisExpression:', () => {
        before('this');
        var expected = [{line:'1', type:'This expression', name:'this', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsArrayExpression:', () => {
        before('[1,2,3]');
        var expected = [{line:'1', type:'Array expression', name:'', condition:'', value:'[1, 2, 3]'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing ast-handler', () => {
    it('valsSequenceExpression:', () => {
        before('{1,2,3}');
        var expected = [{line:'1', type:'Sequence expression', name:'', condition:'', value:'{1, 2, 3}'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsArrowFunctionExpression:', () => {
        before('(x)=>{}');
        var expected = [{line:'1', type:'Arrow Function expression', name:'', condition:'', value:'(x) => {}'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsNewExpression:', () => {
        before('new object()');
        var expected = [{line:'1', type:'New expression', name:'', condition:'', value:'object()'}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});
describe('Testing ast-handler', () => {
    it('valsConditionalExpression:', () => {
        before('x ? y : z');
        var expected = [{line:'1', type:'Conditional expression', name:'', condition:'x ? y : z', value:''}];
        var actual = ast_handler.getExpressions();
        compareExpectedToOutput(expected, actual);
    });
});




