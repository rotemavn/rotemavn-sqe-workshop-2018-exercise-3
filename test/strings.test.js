// import assert from 'assert';
// import * as strings from '../src/js/strings';
// import {parseCode} from '../src/js/code-analyzer';
//
// describe('Testing string representation functions', () => {
//     it('Identifier 1:', () => {
//         var program = parseCode('a');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"a"'
//         );
//     });
//
// });
// describe('Testing string representation functions', () => {
//     it('Identifier 2:', () => {
//         var program = parseCode('RotemAvni');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"RotemAvni"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('Identifier 3:', () => {
//         var program = parseCode('RA3');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"RA3"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('Literal:', () => {
//         var program = parseCode('123');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '123'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('FunctionDeclaration:', () => {
//         var program = parseCode('function funcName(a,b,c){}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0])),
//             '"funcName"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('WhileStatement:', () => {
//         var program = parseCode('while(x>0){x++;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0])),
//             '"x>0"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('IfStatement:', () => {
//         var program = parseCode('if(x===true){x=false;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0])),
//             '"x===true"'
//         );
//     });
// });
//
//
// describe('Testing string representation functions', () => {
//     it('VariableDeclarator 1:', () => {
//         var program = parseCode('var variable;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].declarations[0])),
//             '"variable"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('VariableDeclarator2:', () => {
//         var program = parseCode('var variable = undefined;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].declarations[0])),
//             '"variable=undefined"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('ReturnStatement:', () => {
//         var program = parseCode('function x(){return 0;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].body.body[0])),
//             '0'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('AssignmentExpression:', () => {
//         var program = parseCode('x=3;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"x=3"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('BinaryExpression:', () => {
//         var program = parseCode('x=x+1;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression.right)),
//             '"x+1"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('MemberExpression 1:', () => {
//         var program = parseCode('x=x[1];');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression.right)),
//             '"x[1]"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('MemberExpression 2:', () => {
//         var program = parseCode('x=x.name;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression.right)),
//             '"x.name"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('UnaryExpression:', () => {
//         var program = parseCode('function x(){return -x;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].body.body[0])),
//             '"-x"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ForStatement:', () => {
//         var program = parseCode('var i;for(i=0; i<2; i++){i++;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[1])),
//             '"i=0; i<2; i++"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('UpdateExpression 1:', () => {
//         var program = parseCode('i++;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"i++"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('UpdateExpression 2:', () => {
//         var program = parseCode('++i;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"++i"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('LogicalExpression:', () => {
//         var program = parseCode('a&&b;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"a && b"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('CallExpression:', () => {
//         var program = parseCode('a(x,y)');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"a(x, y)"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ThisExpression:', () => {
//         var program = parseCode('this');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"this"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ArrayExpression:', () => {
//         var program = parseCode('[1,2,3]');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"[1, 2, 3]"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('SequenceExpression:', () => {
//         var program = parseCode('{1,2,3}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].body[0].expression)),
//             '"{1, 2, 3}"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ArrowFunctionExpression:', () => {
//         var program = parseCode('(x, y) => x * y');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"(x, y) => {x*y}"'
//         );
//     });
// });
// describe('Testing string representation functions', () => {
//     it('NewExpression 1:', () => {
//         var program = parseCode('x=new Object()');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression.right)),
//             '"Object()"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('NewExpression 2:', () => {
//         var program = parseCode('x=new Object(1, 2)');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression.right)),
//             '"Object(1, 2)"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ConditionalExpression:', () => {
//         var program = parseCode('x % 2 ? "odd" : "even"');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].expression)),
//             '"x%2 ? odd : even"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('VariableDeclarator:', () => {
//         var program = parseCode('var variable;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0])),
//             '"variable"'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('BlockStatement:', () => {
//         var program = parseCode('function x(){x=1;}');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0].body)),
//             '""'
//         );
//     });
// });
//
// describe('Testing string representation functions', () => {
//     it('ExpressionStatement:', () => {
//         var program = parseCode('x=1;');
//         assert.equal(
//             JSON.stringify(strings.findStringRepresentation(program.body[0])),
//             '""'
//         );
//     });
// });