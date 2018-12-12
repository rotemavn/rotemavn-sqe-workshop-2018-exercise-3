import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import * as bl from '../src/js/substitute';
import {parseCode} from '../src/js/code-analyzer';


function before(code, inputParams){
    bl.restart();
    ast_handler.restartExpressions();
    var parsedCode = parseCode(code).body;
    ast_handler.getValues(parsedCode);
    var expressions = ast_handler.getExpressions();
    var params = bl.createParamVector(inputParams);
    bl.substitute(expressions, params, parsedCode);
}

const nonRelevantKeys = ['range', 'loc', '0', '1', 'line', 'start', 'end', 'col', 'color', 'raw'];


function compareObjectsNotArray(expected, actual, key){
    if(!nonRelevantKeys.includes(key)){
        expected = expected[key];
        actual = actual[key];
        compare(expected, actual);
    }
}


function compareObjects(expected, actual){
    var i, j, key;
    if(expected.length !== undefined){
        for(i=0; i<expected.length; i++){
            const keys = Object.keys(expected[i]);
            for(j=0; j<keys.length; j++){
                key = keys[j];
                compareObjectsNotArray(expected[i], actual[i], key);
            }}}
    else {
        const keys = Object.keys(actual);
        for (j = 0; j < keys.length; j++) {
            key = keys[j];
            compareObjectsNotArray(expected, actual, key);
        }}
}

function compare(expected, actual){
    try {
        if(expected == null) {
            assert.equal(true, true);
        }
        else if (typeof(expected) === 'object' && typeof(actual) === 'object')
            compareObjects(expected, actual);
        else
            assert.equal(expected, actual);
    }
    catch (e) {
        assert.fail('One of compared object is undefined');
    }

}


function compareExpectedToOutput(expected, actual){
    var i;
    for(i=0; i<expected.length; i++) {
        const keys = Object.keys(expected[i]);
        var j;
        for(j=0; j<keys.length; j++){
            var key = keys[j];
            var ex = expected[i][key];
            var ac = actual[i][key];
            compare(ex, ac);
        }
    }
}


describe('Testing Substitute', () => {
    it('Binary expression:', () => {
        var testText = 'function f(x,y){\n' +
            'let a=x+y;\n' +
            'return a;\n' +
            '}';
        var resultFunc = 'function f(x,y){\n' +
            'return x+y;\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('While Statement:', () => {
        var testText = 'function f(x,y){\n let a=x+y;\n while(a<10){\na=a+1;\n}}';
        var resultFunc = 'function f(x,y){\n' +
            'while(x+y<10){\n' +
            '}\n' +
            '}';

        before(testText, '');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('Assignment:', () => {
        var testText = 'let a=2;\n' +
            'function f(x){\n' +
            'let y=a;\n' +
            'y=y+1;\n' +
            'return y;\n' +
            '}';
        var resultFunc = 'function f(x){\n' +
            'return a+1;\n' +
            '}';

        before(testText, '');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        // var actual = [bl.getFuncObj(ast_handler.getExpressions())];
        compareExpectedToOutput(expected, actual);
    });
});


describe('Testing Substitute', () => {
    it('Binary expression with params:', () => {
        var testText = 'function f(x,y){\n' +
            'let a=x+y;\n' +
            'return a;\n' +
            '}';
        var resultFunc = 'function f(x,y){\n' +
            'return x+y;\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});


describe('Testing Substitute', () => {
    it('Binary expression replace values:', () => {
        var testText = 'function f(x,y){\n' +
            'let a=x+y;\n' +
            'a=y-x;\n' +
            'return a;\n' +
            '}';
        var resultFunc = 'function f(x,y){\n' +
            'return y-x;\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('While Statement with expression inside:', () => {
        var testText = 'function f(x,y){\n let a=x+y;\n while(a<10){\nx=a+1;\n}}';
        var resultFunc = 'function f(x,y){\n' +
            'while(x+y<10){\n' +
            'x = x + y + 1;\n' +
            '}\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('If Statement:', () => {
        var testText = 'function f(x,y){\n let a=x+y;\n if(a<10){\nx=a+1;\n}}';
        var resultFunc = 'function f(x,y){\n' +
            'if(x+y<10){\n' +
            'x = x + y + 1;\n' +
            '}\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('If Statement not necessary:', () => {
        var testText = 'function f(x,y){\n let a=x+y;\n if(a<10){\na=a+1;\n}}';
        var resultFunc = 'function f(x,y){\n' +
            'if(x+y<10){\n' +
            '}\n' +
            '}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('If Statement with alternate:', () => {
        var testText = 'function f(x,y){\nlet a=x+y;\nif(a<10){\na=a+1;}\nelse{a=a-1\n}\n}';
        var resultFunc = 'function f(x,y){\nif(x+y<10){}\nelse{}\n}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('If Statement with alternate necessary:', () => {
        var testText = 'function f(x,y){\nlet a=x+y;\nif(a<10){\nx=a+1;}\nelse{x=a-1\n}\n}';
        var resultFunc = 'function f(x, y) {\nif (x + y < 10) {\nx = x + y + 1;\n} else {\nx = x + y - 1;\n}}';

        before(testText, '1,2');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('testing html string while:', () => {
        var testText = 'function f(x,y){\n let a=x+y;\n while(a<10){\nx=a+1;\n}}';
        before(testText, '1,2');
        var expected = 'function f(x, y){<br>&emsp;while(x+y&lt;10)<br>&emsp;{<br>&emsp;x = x + y + 1;<br>&emsp;}<br>}';
        var actual = bl.getFuncHTML();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('testing html string if:', () => {
        var testText = 'function f(x,y){\nlet a=x+y;\nif(a<10){\nx=a+1;}\nelse{x=a-1\n}\n}';
        before(testText, '1,2');
        var expected = 'function f(x, y){<br><em style="color:green">if(x+y&lt;10)</em><br>{<br>&emsp;x = x + y + 1;<br>}<br>else &emsp;{\n' +
            '    x = x + y - 1;\n' +
            '}<br><br><br>}';
        var actual =  bl.getFuncHTML();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('testing html string if without else:', () => {
        var testText = 'function f(x,y){\nlet a=x+y;\nif(a<10){\nx=a+1;}\n}';
        before(testText, '1,2');
        var expected = 'function f(x, y){<br><em style="color:green">if(x+y&lt;10)</em><br>{<br>&emsp;x = x + y + 1;<br>}<br>}';
        var actual =  bl.getFuncHTML();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('testing html string nothing inside if', () => {
        var testText = 'function f(x,y){\nlet a=x+y;\nif(a<10){\na=a+1;}\n}';
        before(testText, '1,2');
        var expected = 'function f(x, y){<br><em style="color:green">if(x+y&lt;10)</em><br>{<br>&emsp;<br>}<br>}';
        var actual =  bl.getFuncHTML();
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('function without params:', () => {
        var testText = 'let a=1;\nfunction f(){\n return a;\n}';
        var resultFunc = 'function f(){\n' +
            ' return a;\n}';
        before(testText, '');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('Binary expression with two literals:', () => {
        var testText = 'function foo(x, y, z){\n' +
            '    let c = 0;\n' +
            '    if (x < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}';
        var resultFunc = 'function foo(x, y, z){\n' +
            'if(x<z)\n' +
            '{\n' +
            ' return x + y + z + 5;\n' +
            '}\n}';
        before(testText, '1,2,3');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});


describe('Testing Substitute', () => {
    it('Member expression:', () => {
        var testText = 'function foo(x, y, z){\n' +
            '    let c = 0;\n' +
            '    if (x < z) {\n' +
            '        c = y[0];\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}';
        var resultFunc = 'function foo(x, y, z){\n' +
            'if(x<z)\n' +
            '{\n' +
            ' return x + y + z + y[0];\n' +
            '}\n}';
        before(testText, '1,2,3');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('Array expression:', () => {
        var testText = 'function foo(x, y, z){\n' +
            '    let c = 0;\n' +
            '    if (x < z) {\n' +
            '        c = [0,1];\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}';
        var resultFunc = 'function foo(x, y, z){\n' +
            'if(x<z)\n' +
            '{\n' +
            ' return x + y + z + [0,1];\n' +
            '}\n}';
        before(testText, '1,2,3');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});

describe('Testing Substitute', () => {
    it('Empty array expression:', () => {
        var testText = 'function foo(x, y, z){\n' +
            '    let c = 0;\n' +
            '    if (x < z) {\n' +
            '        c = [];\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}';
        var resultFunc = 'function foo(x, y, z){\n' +
            'if(x<z)\n' +
            '{\n' +
            ' return x + y + z + [];\n' +
            '}\n}';
        before(testText, '1,2,3');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});


describe('Testing Substitute', () => {
    it('Red Line', () => {
        var testText = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n}\n}';
        var resultFunc = 'function foo(x, y, z){\n' +
            'if(x+1+y<z)\n' +
            '{\n' +
            ' return x + y + z + 5;\n' +
            '}\n' +
            '}';
        before(testText, '1,2,3');
        var expected = parseCode(resultFunc).body;
        var actual = [bl.getResFunc()];
        compareExpectedToOutput(expected, actual);
    });
});
