import assert from 'assert';
import * as ast_handler from '../src/js/ast-handler';
import * as bl from '../src/js/find-path';
import {testFunction} from '../src/js/find-path';
import {parseCode} from '../src/js/code-analyzer';


function before(){
    bl.restartFindPath();
    ast_handler.restartExpressions();
}
function before2(){
    before();
    let v = {name: 'x', valueObj: lit_1, type: 'Identifier'};
    testFunction('createNewInitVar', [v, []]);
    let xValueObj = {type: 'Literal', value: 3};
    v = {name: 'y', valueObj: xValueObj, type: 'Identifier'};
    testFunction('createNewInitVar', [v, []]);
}

function before3(code, inputParams){
    bl.restartFindPath();
    ast_handler.restartExpressions();
    let parsedCode = parseCode(code).body;
    ast_handler.getValues(parsedCode);
    let expressions = ast_handler.getExpressions();
    let params = bl.createParamVector(inputParams);
    bl.iterateCode(expressions, params, parsedCode);
}

const nonRelevantKeys = ['range', 'loc', '0', '1', 'line', 'start', 'end', 'col', 'color', 'raw'];
const x_id = {type: 'Identifier', name: 'x'};
const y_id = {type: 'Identifier', name: 'y'};
const lit_1 = {type: 'Literal', value: 1};

function compareObjectsNotArray(expected, actual, key){
    if(!nonRelevantKeys.includes(key)){
        expected = expected[key];
        actual = actual[key];
        compare(expected, actual);
    }
}


function compareObjects(expected, actual){
    let i, j, key;
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
    let i;
    if(expected.length === undefined)
        compare(expected, actual);
    else if(expected.length !== actual.length){
        assert.fail('Different lengths');
    }
    else {
        for (i = 0; i < expected.length; i++) {
            const keys = Object.keys(expected[i]);
            let j;
            for (j = 0; j < keys.length; j++) {
                let key = keys[j];
                let ex = expected[i][key];
                let ac = actual[i][key];
                compare(ex, ac);
            }
        }
    }
}


describe('varValuesSet', () => {
    it('Empty vars:', () => {
        before();
        testFunction('varValuesSet', ['a', 1, 0]);
        let actual = testFunction('getScopes', []);
        compareExpectedToOutput([[{name: 'a', value:1}]], actual);
    });
    it('Adding vars:', () => {
        testFunction('varValuesSet', ['b', 2, 0]);
        let actual = testFunction('getScopes', []);
        compareExpectedToOutput([[{name: 'a', value:1},{name: 'b', value:2} ]], actual);
    });
    it('Different scope:', () => {
        testFunction('varValuesSet', ['c', 3, 1]);
        let actual = testFunction('getScopes', []);
        compareExpectedToOutput([[{name: 'a', value:1},{name: 'b', value:2} ], [{name: 'c', value:3}]], actual);
    });
});

describe('createParamVector', () => {
    it('Zero params:', () => {
        before();
        let actual = testFunction('createParamVector', ['']);
        compareExpectedToOutput([], actual);
    });
    it('One param:', () => {
        before();
        let actual = testFunction('createParamVector', ['1']);
        let expected = parseCode('1').body[0].expression;
        compareExpectedToOutput(expected, actual);
    });
    it('Two params:', () => {
        before();
        let actual = testFunction('createParamVector', ['1, 2']);
        let expected = parseCode('1, 2').body[0].expression.expressions;
        compareExpectedToOutput(expected, actual);
    });

});

describe('getFuncObj', () => {
    it('check function:', () => {
        before();
        let expressions = [{type:'FunctionDeclaration', valueObj:['let x=1;']}];
        let actual = testFunction('getFuncObj', [expressions]);
        let expected = ['let x=1;'];
        //
        // console.log('actual = ', actual);
        // console.log('expected = ', expected);
        compareExpectedToOutput(expected, actual);
    });
    it('no function:', () => {
        before();
        let expressions = [{type:'NoType', valueObj:['let x=1;']}];
        let actual = testFunction('getFuncObj', [expressions]);
        assert.equal(actual, undefined);
    });
});


describe('resetScope', () => {
    it('delete scope 0:', () => {
        before();
        testFunction('varValuesSet', ['a', 1, 0]);
        testFunction('resetScope', [0]);
        let scopes = testFunction('getScopes', []);
        compare(scopes, [[]]);
    });
});

describe('conditionalAddToValueVector', () => {
    it('set 1:', () => {
        before();
        let id = x_id;
        let ex = {type: 'Literal', value: 1};
        testFunction('conditionalAddToValueVector', [id, ex, 0]);
        let scopes = testFunction('getScopes', []);
        compareExpectedToOutput(scopes, [[{name: 'x', value:ex}]]);
    });
});


describe('createNewInitVar', () => {
    it('NOT FunctionDeclaration:', () => {
        before();
        let xValueObj = {type: 'Literal', value: 1};
        let ex = {name: 'x', valueObj: xValueObj, type: 'Identifier'};
        testFunction('createNewInitVar', [ex, []]);
        let scopes = testFunction('getScopes', []);
        compareExpectedToOutput(scopes, [[{name: 'x', value:xValueObj}]]);
    });
    it('YES FunctionDeclaration:', () => {
        before();
        let xValueObj = {type: 'Literal', value: 1};
        let ex = {type: 'FunctionDeclaration', params:[x_id]};
        testFunction('createNewInitVar', [ex, [xValueObj]]);
        let scopes = testFunction('getScopes', []);
        compareExpectedToOutput(scopes, [[{name: 'x', value:xValueObj}]]);
    });
});

describe('createInputVector', () => {
    it('NOT FunctionDeclaration:', () => {
        before();
        let xValueObj = {type: 'Literal', value: 1};
        let expressions = [{name: 'x', valueObj: xValueObj, type: 'Identifier'}];
        testFunction('createInputVector', [expressions, []]);
        let scopes = testFunction('getScopes', []);
        compareExpectedToOutput(scopes, [[{name: 'x', value:xValueObj}]]);
    });
});


describe('Iterate structures', () => {
    it('Literal', () => {
        before();
        let ex = {type: 'Literal', value: 1};
        let actual = testFunction('iterateLiteral', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'Literal', value: 1, color:'green'}, actual);
    });
    it('Identifier', () => {
        before();
        let actual = testFunction('iterateIdentifier', [x_id, 0, 'green']);
        compareExpectedToOutput({type: 'Identifier', name: 'x', color:'green'}, actual);
    });
    it('BinaryExpression', () => {
        before();
        let ex = {type: 'BinaryExpression', operator: '>', left: x_id, right: y_id};
        let actual = testFunction('iterateBinaryExpression', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'BinaryExpression', operator: '>', left: x_id, right: y_id, color:'green'}, actual);
    });
    it('Return', () => {
        before();
        let ex = {type: 'ReturnStatement', argument: x_id};
        let actual = testFunction('iterateReturn', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'ReturnStatement', argument: x_id, color:'green'}, actual);
    });
    it('VariableDeclaration', () => {
        before();

        let id = x_id;
        let lit = {type: 'Literal', value: 1};
        let decl = {type: 'VariableDeclarator', id: id, init: lit};
        let ex = {type: 'VariableDeclaration', declarations: [decl]};
        let newDecl = {type: 'VariableDeclarator', id: id, init: lit, color: 'green'};
        let actual = testFunction('iterateVariableDeclaration', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'VariableDeclaration', declarations: [newDecl]}, actual);
    });
    it('VariableDeclarator', () => {
        before();

        let id = x_id;
        let lit = lit_1;
        let ex = {type: 'VariableDeclarator ', id: id, init: lit};
        let newDecl = {type: 'VariableDeclarator ', id: id, init: lit, color: 'green'};
        let actual = testFunction('iterateVariableDeclarator', [ex, 0, 'green']);
        compareExpectedToOutput(newDecl, actual);
    });

    it('WhileStatement', () => {
        before2();

        let binaryExp = {type: 'BinaryExpression', operator: '>', left:x_id, right:y_id};
        let returnStmt = {type: 'ReturnStatement', argument: x_id};
        let expressionStatement  = {type: 'ExpressionStatement', expression: returnStmt};
        let ex = {type: 'WhileStatement ', test: binaryExp, body: {type: 'BlockStatement', body:[expressionStatement]}};

        let expectedBinaryExp = {type: 'BinaryExpression', operator: '>', left: x_id, right: y_id, color:'green'};
        let expectedReturnStmt = {type: 'ReturnStatement', argument: x_id, color:'grey'};
        let expectedExpressionStatement = {type: 'ExpressionStatement', expression: expectedReturnStmt, color:'grey'};


        let actual = testFunction('iterateWhileStatement', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'WhileStatement ', test: expectedBinaryExp,
            body: {type: 'BlockStatement', body:[expectedExpressionStatement]}}, actual);
    });
    it('AssignmentExpression', () => {
        let ex = {type: 'AssignmentExpression', operator: '=', left: x_id, right:lit_1};
        let actual = testFunction('iterateAssignmentExpression', [ex, 0, 'green']);
        let expected = {type: 'AssignmentExpression', operator: '=', left: x_id, right:{type: 'Literal', value: 1, color:'green'}, color:'green'};
        compareExpectedToOutput(expected, actual);
    });
    it('IfStatement no alternate', () => {
        before2();
        let binaryExp = {type: 'BinaryExpression', operator: '>', left:x_id, right:y_id};
        let returnStmt = {type: 'ReturnStatement', argument: x_id};
        let expressionStatement  = {type: 'ExpressionStatement', expression: returnStmt};
        let blockStmt = {type: 'BlockStatement', body:[expressionStatement]};

        let ex = {type: 'IfStatement', test: binaryExp, consequent: blockStmt, alternate:null};
        let actual = testFunction('iterateIfStatement', [ex, 0, 'green']);

        let expectedBinaryExp = {type: 'BinaryExpression', operator: '>', left:x_id, right:y_id, color:'green'};
        let expectedReturnStmt = {type: 'ReturnStatement', argument: x_id, color:'green'};
        let expectedExpressionStatement  = {type: 'ExpressionStatement', expression: expectedReturnStmt, color:'green'};
        let expectedBlockStmt = {type: 'BlockStatement', body:[expectedExpressionStatement]};


        let expected = {type: 'IfStatement', test: expectedBinaryExp, consequent: expectedBlockStmt, alternate:null};
        compareExpectedToOutput(expected, actual);
    });
    it('IfStatement no alternate2', () => {
        before2();
        let binaryExp = {type: 'BinaryExpression', operator: '<', left:x_id, right:y_id};
        let returnStmt = {type: 'ReturnStatement', argument: x_id};
        let expressionStatement  = {type: 'ExpressionStatement', expression: returnStmt};
        let blockStmt = {type: 'BlockStatement', body:[expressionStatement]};

        let ex = {type: 'IfStatement', test: binaryExp, consequent: blockStmt, alternate:null};
        let actual = testFunction('iterateIfStatement', [ex, 0, 'green']);

        let expectedBinaryExp = {type: 'BinaryExpression', operator: '<', left:x_id, right:y_id, color:'green'};
        let expectedReturnStmt = {type: 'ReturnStatement', argument: x_id, color:'green'};
        let expectedExpressionStatement  = {type: 'ExpressionStatement', expression: expectedReturnStmt, color:'green'};
        let expectedBlockStmt = {type: 'BlockStatement', body:[expectedExpressionStatement]};


        let expected = {type: 'IfStatement', test: expectedBinaryExp, consequent: expectedBlockStmt, alternate:null};
        compareExpectedToOutput(expected, actual);
    });
    it('IfStatement with alternate', () => {
        before2();
        let binaryExp = {type: 'BinaryExpression', operator: '>', left:x_id, right:y_id};
        let returnStmt = {type: 'ReturnStatement', argument: x_id};
        let expressionStatement  = {type: 'ExpressionStatement', expression: returnStmt};
        let blockStmt = {type: 'BlockStatement', body:[expressionStatement]};

        let ex = {type: 'IfStatement', test: binaryExp, consequent: blockStmt, alternate:blockStmt};
        let actual = testFunction('iterateIfStatement', [ex, 0, 'green']);

        let expectedBinaryExp = {type: 'BinaryExpression', operator: '>', left:x_id, right:y_id, color:'green'};
        let expectedReturnStmt1 = {type: 'ReturnStatement', argument: x_id, color:'green'};
        let expectedExpressionStatement1  = {type: 'ExpressionStatement', expression: expectedReturnStmt1, color:'green'};
        let expectedBlockStmt1 = {type: 'BlockStatement', body:[expectedExpressionStatement1]};

        let expectedReturnStmt2 = {type: 'ReturnStatement', argument: x_id, color:'grey'};
        let expectedExpressionStatement2  = {type: 'ExpressionStatement', expression: expectedReturnStmt2, color:'grey'};
        let expectedBlockStmt2 = {type: 'BlockStatement', body:[expectedExpressionStatement2]};


        let expected = {type: 'IfStatement', test: expectedBinaryExp, consequent: expectedBlockStmt1, alternate:expectedBlockStmt2};
        compareExpectedToOutput(expected, actual);
    });
    it('BlockStatement', () => {
        before2();
        let returnStmt = {type: 'ReturnStatement', argument: x_id};
        let expressionStatement  = {type: 'ExpressionStatement', expression: returnStmt};
        let ex = {type: 'BlockStatement', body:[expressionStatement]};
        let actual = testFunction('iterateBlockStatement', [ex, 0, 'green']);

        let expectedReturnStmt = {type: 'ReturnStatement', argument: x_id, color:'green'};
        let expectedExpressionStatement  = {type: 'ExpressionStatement', expression: expectedReturnStmt, color:'green'};
        let expectedBlockStmt = {type: 'BlockStatement', body:[expectedExpressionStatement], color:'green'};


        compareExpectedToOutput(expectedBlockStmt, actual);
    });
    it('MemberExpression', () => {
        before();
        let ex = {type: 'MemberExpression', object: x_id, property: lit_1};
        let actual = testFunction('iterateMemberExpression', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'MemberExpression', object: x_id, property: lit_1, color:'green'}, actual);
    });
    it('ArrayExpression', () => {
        before();
        let ex = {type: 'ArrayExpression', elements: [x_id]};
        let actual = testFunction('iterateArrayExpression', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'ArrayExpression', elements: [x_id], color:'green'}, actual);
    });
    it('UpdateExpression', () => {
        before();
        let ex = {type: 'UpdateExpression', argument: x_id};
        let actual = testFunction('iterateUpdateExpression', [ex, 0, 'green']);
        compareExpectedToOutput({type: 'UpdateExpression', argument: x_id, color:'green'}, actual);
    });
});



describe('getOppositeColor', () => {
    it('green:', () => {
        let actual = testFunction('getOppositeColor', ['green']);
        assert.equal(actual,'grey');
    });
    it('grey:', () => {
        let actual = testFunction('getOppositeColor', ['grey']);
        assert.equal(actual,'green');
    });
});





describe('Testing iterateCode', () => {
    it('Binary expression:', () => {
        let testText = 'function f(x,y){\n' +
            'let a=x+y;\n' +
            'return a;\n' +
            '}';
        let resultFunc = testText;

        before3(testText, '1,2');
        let expected = parseCode(resultFunc).body[0].body;
        let actual = bl.getResFuncBody();
        compareExpectedToOutput(expected, actual);
    });
});



