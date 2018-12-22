import {findStringRepresentation} from './strings';

var esprima = require('esprima');
const esgraph = require('esgraph');
var dot = require('graphlib-dot');
var dagreD3 = require('dagre-d3');
const Viz = require('viz.js');

// const { Module, render } = require('viz.js/full.render.js');

function createGraph(source, plaintext){
    // var source = 'let a = x + 1;let b = a + y;let c = 0;if (b < z) {c = c + 5;}else if (b < z * 2) {c = c + x + 5;}';
    const cfg = esgraph(source);
    console.log(cfg);
    const graph = esgraph.dot(cfg, { counter: 0, source: plaintext});
    var svg = Viz('digraph {'+graph+'}');
    console.log('debug');
    return svg;
}

var globalCounter = 0;

var transitions;


var createBlock = {
    'IfStatement': createIfStatement,
    // 'VariableDeclaration': createVariableDeclaration,
    // 'VariableDeclarator': createVariableDeclarator,
    // 'WhileStatement': createWhileStatement,
    // 'ReturnStatement': createReturn,
    //
    //
    // 'BinaryExpression': iterateBinaryExpression,
    // 'Literal': iterateLiteral,
    // 'Identifier': iterateIdentifier,
    // 'ExpressionStatement': iterateExpressionStatement,
    // 'AssignmentExpression': iterateAssignmentExpression,
    // 'BlockStatement': iterateBlockStatement,
    // 'MemberExpression': iterateMemberExpression,
    // 'ArrayExpression': iterateArrayExpression,
};

function createIfStatement() {
    
}


function getBlockLabel(name, blocks){
    var i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i].str;
    }
    return '';
}

function removeStartAndEnd(blocksAndTrans, numOfBlocks){
    var start = blocksAndTrans[0].split('[')[0];
    var end = blocksAndTrans[numOfBlocks].split('[')[0];
    var i;
    var ret = [];

    for(i=1; i<blocksAndTrans.length; i++){
        if(!blocksAndTrans[i].includes(start) && !blocksAndTrans[i].includes(end)){
            ret.push(blocksAndTrans[i]);
        }
    }

    return ret;
}

function concatToGraph(blocksAndTrans){
    console.log(blocksAndTrans);
    var graph = '';
    var i;
    for(i=0; i<blocksAndTrans.length; i++){
        graph += blocksAndTrans[i]+']\n';
    }
    return graph;
}

function bothVariableDecl(from,to, blocks){
    var i;
    var res = true;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === from || blocks[i].name === to) {
            res = res && (blocks[i].type === 'VariableDeclaration');
        }
    }
    return res;

}

function mergeBlocks(blocksAndTrans, numOfBlocks, blocks){
    var toMerge = [];
    var i;
    var prev = blocksAndTrans[numOfBlocks+1].split(' -> ')[0];
    toMerge.push(from);
    for(i=numOfBlocks+1; i<blocksAndTrans.length; i++){
        var splitted = blocksAndTrans[i].split(' ->');
        var from = splitted[0];
        var to = splitted[1];
        while(from === prev && bothVariableDecl(from,to, blocks)){
            toMerge.push(to);
            prev = to;
            splitted = blocksAndTrans[i].split(' ->');
            from = splitted[0];
            to = splitted[1];
            i+=1;
        }

    }
}


function editTags(graph){
    var split1 =graph.toLocaleString().split(']\n');
    var blocksAndTrans = [];
    var j;
    for(j=0; j<split1.length; j++){
        var split2  = split1[j].split(' [');
        if(split2[1] === undefined)
            continue;
        var toAdd = '[';
        if(split2[1].includes('true'))
            toAdd =' [label=true ';
        else if(split2[1].includes('false'))
            toAdd =' [label=false ';
        else
            toAdd = '[';
        blocksAndTrans.push(split2[0] += toAdd);
    }
    return blocksAndTrans;
}


function createFlowChart(functionBody){
    const cfg = esgraph(functionBody)[2];
    const graph = esgraph.dot(esgraph(functionBody), { counter: 0});
    var blocks = [], i;

    for(i=1; i<cfg.length-1; i++){
        var block = {name: 'n'+i, type: cfg[i].astNode.type, str: findStringRepresentation(cfg[i].astNode), color: cfg[i].astNode.color};
        blocks.push(block);
    }

    var blocksAndTrans = editTags(graph);
    blocksAndTrans = removeStartAndEnd(blocksAndTrans, blocks.length+1);

    for(i=0; i<blocks.length; i++){
        var label = blocks[i].str;
        var color = blocks[i].color;
        blocksAndTrans[i] += 'label="' + label + '" color='+color+' style=filled';
    }
    return Viz('digraph {' + concatToGraph(blocksAndTrans) + '}');
}


export {createGraph,createFlowChart};

