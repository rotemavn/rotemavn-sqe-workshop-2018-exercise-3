import assert from 'assert';
import {getOrSet, restartGraphCreation, testFunction} from '../src/js/graph_creation';
import {parseCode} from '../src/js/code-analyzer';
import {getValues, getExpressions} from '../src/js/ast-handler';
import {getResFuncBody, iterateCode, createParamVector} from '../src/js/find-path';


let blocks1 = [
    {name: 'n0', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'},
    {name: 'n1', type: 'BinaryExpression', str: 'a<z', color: 'green'},
    {name: 'n2', type: 'ReturnStatement', str: 'return z', color: 'green'},
];
let blocks2 = [
    {name: 'n0', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'},
    {name: 'n1', type: 'BinaryExpression', str: 'a<z\nreturn z\n', color: 'green'},
];

let blocks3 = [
    {name: 'n0', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'},
    {name: 'n1', type: 'BinaryExpression', str: 'a<z', color: 'green'},
    {name: 'n2', type: 'ReturnStatement', str: 'return z', color: 'green'},
    {name: 'n3', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'}
];
let nodes1 = [
    'n0 [label="a=x+1"',
    'n1 [label="a<z"',
    'n2 [label="return z"',
];
let nodes2 = ['n0', 'n1', 'n2'];
let nodes3 = ['n0', 'n1', 'n2', 'n3'];

let transitions1 = [
    {from: 'n0', to:'n1', label: ''},
    {from: 'n1', to:'n2', label: ''}
];
let transitions11 = [
    {from: 'n0', to:'n1', label: ''},
    {from: 'n1', to:'n2', label: ''}
];

let transitions2 = [
    {from: 'n0', to:'n1', label: ''},
    {from: 'n0', to:'n3', label: ''},
    {from: 'n0', to:'n4', label: ''},
    {from: 'n1', to:'n2', label: ''},
];



let blocksWhileExample = [
    {name: 'n1', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'},
    {name: 'n2', type: 'VariableDeclaration', str: 'b=a+y', color: 'green'},
    {name: 'n3', type: 'VariableDeclaration', str: 'c=0', color: 'green'},
    {name: 'n4', type: 'BinaryExpression', str: 'a<z', color: 'green'},
    {name: 'n5', type: 'AssignmentExpression', str: 'c=a+b', color: 'grey'},
    {name: 'n8', type: 'ReturnStatement', str: 'return z', color: 'green'},
];

let blocksWhileExampleAfterMerge = [
    {name: 'n1', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'},
    {name: 'n4', type: 'BinaryExpression', str: 'a<z', color: 'green'},
    {name: 'n5', type: 'AssignmentExpression', str: 'c=a+b', color: 'grey'},
    {name: 'n8', type: 'ReturnStatement', str: 'return z', color: 'green'},
];

let nodesWhileExample = ['n1','n2','n3','n4','n5','n8'];
let nodesWhileExampleAfterMerge = ['n1','n4','n5','n8'];

let transWhileExample = [
    {from: 'n1', to: 'n2', label: '""'},
    {from: 'n2', to: 'n3', label: '""'},
    {from: 'n3', to: 'n4', label: '""'},
    {from: 'n4', to: 'n5', label: 'true'},
    {from: 'n4', to: 'n8', label: 'false'},
    {from: 'n5', to: 'n4', label: '""'}
];

let transWhileExampleAfterMerge = [
    {from: 'n1', to: 'n4', label: '""'},
    {from: 'n4', to: 'n5', label: 'true'},
    {from: 'n4', to: 'n8', label: 'false'},
    {from: 'n5', to: 'n4', label: '""'}
];


function compareArrays(a1, a2){
    if(a1.length !== a2.length){
        assert.fail('Array lengths dont match');
    }
    else{
        let i;
        for(i=0; i<a1.length; i++){
            if(Array.isArray(a1[i]) && Array.isArray(a2[i]))
                compareArrays(a1[i], a2[i]);
            else if(typeof (a1[i]) === 'object' && typeof (a1[i]) === 'object')
            {
                compareObjects(a1[i], a2[i]);
            }
            else{
                assert.equal(a1[i], a2[i]);
            }
        }
    }
}

function compareObjects(o1, o2){
    const keys = Object.keys(o1);
    for(let j=0; j<keys.length; j++) {
        let key = keys[j];
        if(Array.isArray(o1[key]) && Array.isArray(o2[key]))
            compareArrays(o1[key], o2[key]);
        else
            assert.equal(o1[key], o2[key]);
    }
}



function before(blocksToSet, nodesToSet, transitionsToSet){
    restartGraphCreation();
    if(blocksToSet != null)
        getOrSet('setBlocks', [blocksToSet]);
    if(nodesToSet != null)
        getOrSet('setNodes', [nodesToSet]);
    if(transitionsToSet != null)
        getOrSet('setTransitions', [transitionsToSet]);
}

function before2(){
    restartGraphCreation();
    let parsedCode = parseCode('function foo(x, y, z){\n' +
        '    while(x<z){\n' +
        '        x++;\n' +
        '    }\n' +
        '    return z;\n' +
        '}');
    var body = parsedCode.body;
    body.forEach(getValues);
    var expressions = getExpressions();
    var params = createParamVector('1,2,3');
    iterateCode(expressions, params, body);
    return getResFuncBody();
}

describe('getBlockLabel', () => {
    it('Block exists:', () => {
        before(blocks1, null, null);
        let actual = testFunction('getBlockLabel', ['n0']);
        assert.equal('a=x+1', actual);
    });
    it('Block doesnt exist:', () => {
        let actual = testFunction('getBlockLabel', ['n10']);
        assert.equal('', actual);
    });

});

describe('removeStartAndEnd', () => {
    it('remove start and end', () => {
        before(null, null, null);

        let blocksAndTrans = ['n0[', 'n1[', 'n2[', 'n3[',  'n4['];
        let actual = testFunction('removeStartAndEnd', [blocksAndTrans, 4]);
        compareArrays(['n1[', 'n2[', 'n3['], actual);
    });
});

describe('concatToGraph', () => {
    it('concatToGraph', () => {
        before(null, nodes1, transitions1);
        let actual = testFunction('concatToGraph', []);
        let expected = 'n0 [label="a=x+1" fontname=tahoma]\nn1 [label="a<z" fontname=tahoma]\nn2 [label="return z" fontname=tahoma]\n' +
            'n0 -> n1 [label="" fontname=tahoma]\nn1 -> n2 [label="" fontname=tahoma]\n';
        assert.equal(actual, expected);
    });
});

describe('getNodeType', () => {
    it('Node exists', () => {
        before(blocks1, nodes2, null);
        let actual = testFunction('getNodeType', ['n0']);
        assert.equal(actual, 'VariableDeclaration');
    });
    it('Node doesnt exists', () => {
        before(blocks1, nodes2, null);
        let actual = testFunction('getNodeType', ['n10']);
        assert.equal(actual, '');
    });
});

describe('removeNodes', () => {
    it('removeNodes', () => {
        before(null, nodes2, null);
        let toRemove = ['n0'];
        testFunction('removeNodes', [toRemove]);
        let actual = getOrSet('getNodes', []);
        compareArrays(actual, ['n1', 'n2']);
    });
});

describe('getBlock', () => {
    it('Block exists:', () => {
        before(blocks1, null, null);
        let actual = testFunction('getBlock', ['n0']);
        compareObjects(actual, {name: 'n0', type: 'VariableDeclaration', str: 'a=x+1', color: 'green'});
    });
    it('Block doesnt exist:', () => {
        let actual = testFunction('getBlock', ['n10']);
        assert.equal(actual, null);
    });
});

describe('editBlocks', () => {
    it('editBlocks:', () => {
        before(blocks1, null, null);
        let toMerge = ['n1', 'n2'];
        let toKeep = testFunction('editBlocks', [toMerge]);
        assert.equal(toKeep, 'n1');
        let newBlocks = getOrSet('getBlocks', []);
        compareArrays(newBlocks,blocks2);
    });

});

describe('createTransitionsFromLast', () => {
    it('createTransitionsFromLast:', () => {
        before(null, null, transitions2);
        testFunction('createTransitionsFromLast', ['n0', 'n5']);
        let transitions3 = [
            {from: 'n5', to:'n1', label: ''},
            {from: 'n5', to:'n3', label: ''},
            {from: 'n5', to:'n4', label: ''},
            {from: 'n1', to:'n2', label: ''},
        ];
        let newTransitions = getOrSet('getTransitions', []);
        compareArrays(newTransitions, transitions3);
    });

});

describe('checkIfTwoNodesCanBeMerged', () => {
    it('Can merge:', () => {
        before(blocks3, nodes3, null);
        let ret = testFunction('checkIfTwoNodesCanBeMerged', ['n0', 'n3']);
        assert.equal(ret, true);
    });
    it('Cant merge:', () => {
        before(blocks3, nodes3, null);
        let ret = testFunction('checkIfTwoNodesCanBeMerged', ['n0', 'n1']);
        assert.equal(ret, false);
    });


});

describe('performMerge', () => {
    it('Nothing to merge', () => {
        before(null, nodes3, transitions1);
        testFunction('performMerge', [[],[]]);
        let nodes =  getOrSet('getNodes', []);
        let transitions =  getOrSet('getTransitions', []);
        compareArrays(nodes3, nodes);
        compareArrays(transitions1, transitions);
    });
    it('Merge:', () => {
        before(blocksWhileExample, nodesWhileExample, transWhileExample);
        testFunction('performMerge', [['n1', 'n2', 'n3'],[{from: 'n1', to: 'n2', label: '""'},
            {from: 'n2', to: 'n3', label: '""'}]]);

        let nodes =  getOrSet('getNodes', []);
        let transitions =  getOrSet('getTransitions', []);

        compareArrays(nodesWhileExampleAfterMerge, nodes);
        compareArrays(transWhileExampleAfterMerge, transitions);
    });


});
describe('mergeNodesWithAssignmentOrDecl', () => {
    it('Merge:', () => {
        before(blocksWhileExample, nodesWhileExample, transWhileExample);
        testFunction('mergeNodesWithAssignmentOrDecl', []);

        let nodes =  getOrSet('getNodes', []);
        let transitions =  getOrSet('getTransitions', []);

        compareArrays(nodesWhileExampleAfterMerge, nodes);
        compareArrays(transWhileExampleAfterMerge, transitions);
    });


});

describe('editTags', () => {
    it('edit:', () => {
        let graph =
            'n0 [label="entry", style="rounded"]\n' +
            'n1 [label="VariableDeclaration"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            '"';
        before(null, null, null);
        let actual = testFunction('editTags', [graph]);
        let expected =['n0', 'n1', 'n4 -> n5 true', 'n4 -> n8 false'];
        compareArrays(actual, expected);
    });


});

describe('addProperties', () => {
    it('add properties:', () => {
        let nodes = ['n1', 'n4', 'n5', 'n8', 'n9'];
        let blocks =  [ {name: 'n1', type: 'VariableDeclaration', str: 'a=x+1\nb=a+y\nc=0\n', color: 'green'},
            {name: 'n4', type: 'BinaryExpression', str: 'a<z', color: 'green'},
            {name: 'n5', type: 'AssignmentExpression', str: 'c=a+b\nz=c*2\na++\n', color: 'grey'},
            {name: 'n8', type: 'ReturnStatement', str: 'return z', color: 'green'},
            {name: 'n9', type: 'Merge', str: '', color: 'green'}
        ];
        let transitions = [{from: 'n4', to: 'n5', label: 'true'},
            {from: 'n4', to: 'n8', label: 'false'},
            {from: 'n1', to: 'n9'},
            {from: 'n5', to: 'n9'},
            {from: 'n9', to: 'n4'}];
        before(blocks, nodes, transitions);
        testFunction('addProperties', []);
        let actualNodes = getOrSet('getNodes', []);
        let expectedNodes =['n1[label="((1))\na=x+1\nb=a+y\nc=0\n" color=green style=filled shape=rectangle',
            'n4[label="((2))\na<z" color=green style=filled shape=diamond',
            'n5[label="((3))\nc=a+b\nz=c*2\na++\n" color=grey style=filled shape=rectangle',
            'n8[label="((4))\nreturn z" color=green style=filled shape=rectangle',
            'n9[label="" color=green style=filled  shape=oval'];
        compareArrays(actualNodes, expectedNodes);
    });


});

describe('addNodeAndTransitions', () => {
    it('test:', () => {
        before(blocksWhileExampleAfterMerge, nodesWhileExampleAfterMerge, transWhileExampleAfterMerge);
        let toArray = {n4: ['n1', 'n5'], n5: ['n4'], n8: ['n4']};
        let returnValues = testFunction('addNodeAndTransitions', [toArray, 9]);
        let expected = {
            nodes:['n9'],
            toRemove: [{from: 'n1', to: 'n4'}, {from: 'n5', to: 'n4'}],
            transitions: [{from: 'n1', to: 'n9'}, {from: 'n5', to: 'n9'}, {from: 'n9', to: 'n4'}]
        };
        compareObjects(returnValues, expected);
    });


});

describe('findNewNodeIndex', () => {
    it('test:', () => {
        before(null, nodes2, null);
        let actual = testFunction('findNewNodeIndex', []);
        assert.equal(actual, 3);
    });


});

describe('addMergePoints', () => {
    it('test:', () => {
        before(blocksWhileExampleAfterMerge, nodesWhileExampleAfterMerge, transWhileExampleAfterMerge);
        let returnValues = testFunction('addMergePoints', []);
        let expected = {
            nodes:['n9'],
            toRemove: [{from: 'n1', to: 'n4'}, {from: 'n5', to: 'n4'}],
            transitions: [{from: 'n1', to: 'n9'}, {from: 'n5', to: 'n9'}, {from: 'n9', to: 'n4'}]
        };
        compareObjects(returnValues, expected);
    });


});

describe('addNodes', () => {
    it('test:', () => {
        before(null, nodes3, null);
        testFunction('addNodes', [['n4']]);
        let expected = ['n0', 'n1', 'n2', 'n3', 'n4'];
        let actualNodes = getOrSet('getNodes', []);
        compareArrays(actualNodes, expected);
    });


});

describe('transitionsEquals', () => {
    it('equal:', () => {
        let t1 = {from: 'n0', to:'n1', label: ''};
        let t2 = {from: 'n0', to:'n1', label: ''};
        before(null, null, null);
        let actual = testFunction('transitionsEquals', [t1, t2]);
        assert.equal(actual, true);
    });

    it('not equal:', () => {
        before(null, null, null);
        let t1 = {from: 'n0', to:'n1', label: ''};
        let t2 = {from: 'n1', to:'n2', label: ''};
        before(null, null, null);
        let actual = testFunction('transitionsEquals', [t1, t2]);
        assert.equal(actual, false);
    });


});

describe('removeTransitions', () => {
    it('test:', () => {
        let t1 = {from: 'n0', to:'n1', label: ''};
        before(null, null, transitions1);
        testFunction('removeTransitions', [[t1]]);
        let actualTransitions = getOrSet('getTransitions', []);
        let expected = [{from: 'n1', to:'n2', label: ''}];
        compareArrays(actualTransitions , expected);
    });

});

describe('addTransitions', () => {
    it('test:', () => {
        let t1 = {from: 'n2', to:'n3', label: ''};
        before(null, null, transitions1);
        testFunction('addTransitions', [[t1]]);
        let actualTransitions = getOrSet('getTransitions', []);
        let expected = transitions1;
        expected.push(t1);
        compareArrays(actualTransitions , expected);
    });

});

describe('setTransitionsFromBlocksAndTrans', () => {
    it('test:', () => {
        let blocksAndTrans = ['n0 -> n1', 'n1 -> n2'];
        before(null, null, null);
        testFunction('setTransitionsFromBlocksAndTrans', [0, blocksAndTrans]);
        let actualTransitions = getOrSet('getTransitions', []);
        compareArrays(actualTransitions , transitions11);
    });

});

let expectedNodes = ['n1[label="((1))\nx<z" color=green style=filled shape=diamond',
    'n2[label="((2))\nx++" color=green style=filled shape=rectangle',
    'n3[label="((3))\nreturn z" color=green style=filled shape=rectangle'];
let expectedTransitions = [{from: 'n1', to: 'n2', label: 'true'},
    {from: 'n1', to: 'n3', label: 'false'},
    {from: 'n2', to: 'n1', label: ''}];
describe('createFlowChart', () => {
    it('test:', () => {
        before(null, null, null);
        let functionBody = before2();
        testFunction('createFlowChart', [functionBody]);
        let transitions = getOrSet('getTransitions', []);
        let nodes = getOrSet('getNodes', []);
        compareArrays(transitions , expectedTransitions);
        compareArrays(nodes , expectedNodes);
    });

});

