import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import {parseCode} from '../src/js/code-analyzer';

//
// function before(code){
//     ast_handler.restartExpressions();
//     var program = parseCode(code).body;
//     ast_handler.getValues(program);
// }



describe('Testing ast-handler', () => {
    it('createExpressionObject:', () => {
        ast_handler.restartExpressions();
        ast_handler.createExpressionObject(['1', 'Test', '', '', '']);
        var expected = {line:'1', type:'Test', name:'', condition:'', value:''};
        var actual = ast_handler.getExpressions()[0];
        for(var key in expected){
            assert.equal(expected[key], actual[key]);
        }
    });
});

describe('Testing ast-handler', () => {
    it('valsIdentifier:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('a').body;
        ast_handler.getValues(program);
        var expected = {line:'1', type:'Identifier', name:'a', condition:'', value:''};
        var actual = ast_handler.getExpressions()[0];
        for(var key in expected){
            assert.equal(expected[key], actual[key]);
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsReturnStatement:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('function x(){return 2;}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Function declaration', name:'x', condition:'', value:''},{line:'1', type:'Return statement', name:'', condition:'', value:'2'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsFunctionDeclaration:', () => {
        ast_handler.restartExpressions();
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
describe('Testing ast-handler', () => {
    it('valsFunctionDeclaration:', () => {
        ast_handler.restartExpressions();
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

describe('Testing ast-handler', () => {
    it('valsVariableDeclaration:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('var x=1;').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Variable declaration', name:'x', condition:'', value:'1'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsAssignmentExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('x=1;').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Assignment expression', name:'x', condition:'', value:'1'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsLiteral:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('5').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Literal', name:'', condition:'', value:'5'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsBinaryExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('x+y;').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Binary expression', name:'', condition:'', value:'x+y'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsWhileStatement:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('while(x!=0){x--;}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'While statement', name:'', condition:'x!=0', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});

describe('Testing ast-handler', () => {
    it('valsIfStatement:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('if(x!=0){x--;}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'If statement', name:'', condition:'x!=0', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});


describe('Testing ast-handler', () => {
    it('valsMemberExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('x[1];').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Member expression', name:'x[1]', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});

describe('Testing ast-handler', () => {
    it('valsUnaryExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('-3;').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Unary expression', name:'', condition:'', value:'-3'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsForStatement:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('for(i=0;i<1;i++){}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'For statement', name:'', condition:'i=0; i<1; i++', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsUpdateExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('i++').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Update expression', name:'', condition:'', value:'i++'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsLogicalExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('x&&y').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Logical expression', name:'', condition:'', value:'x && y'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsCallExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('update(x,y);').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Call expression', name:'', condition:'', value:'update(x, y)'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});

describe('Testing ast-handler', () => {
    it('valsThisExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('this').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'This expression', name:'this', condition:'', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsArrayExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('[1,2,3]').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Array expression', name:'', condition:'', value:'[1, 2, 3]'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});

describe('Testing ast-handler', () => {
    it('valsSequenceExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('{1,2,3}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Sequence expression', name:'', condition:'', value:'{1, 2, 3}'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsArrowFunctionExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('(x)=>{}').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Arrow Function expression', name:'', condition:'', value:'(x) => {}'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsNewExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('new object()').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'New expression', name:'', condition:'', value:'object()'}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});
describe('Testing ast-handler', () => {
    it('valsConditionalExpression:', () => {
        ast_handler.restartExpressions();
        var program = parseCode('x ? y : z').body;
        ast_handler.getValues(program);
        var expected = [{line:'1', type:'Conditional expression', name:'', condition:'x ? y : z', value:''}];
        var actual = ast_handler.getExpressions();
        var i;
        for(i=0; i<expected.length; i++) {
            for (var key in expected[i]) {
                assert.equal(expected[i][key], actual[i][key]);
            }
        }
    });
});




