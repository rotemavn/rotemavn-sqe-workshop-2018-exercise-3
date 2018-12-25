import {findStringRepresentation} from './strings';

const esgraph = require('esgraph');
const Viz = require('viz.js');


var transitions = [];
var nodes = [];
var blocks = [];


function restartGraphCreation(){
    transitions = [];
    nodes = [];
    blocks = [];
}


function getBlockLabel(name){
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

function concatToGraph(){
    var graph = '';
    var i;
    for(i=0; i<nodes.length; i++){
        graph += nodes[i]+' fontname=tahoma]\n';
    }
    for(i=0; i<transitions.length; i++){
        var label = transitions[i].label;
        if(label === '' || label === undefined)
            label = '""';
        var transition = transitions[i].from + ' -> ' + transitions[i].to + ' [label='+label;
        graph += transition+' fontname=tahoma]\n';
    }
    return graph;
}


function getNodeType(name){
    var i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i].type;
    }
    return '';
}

function removeNodes(toRemove){
    var changed = [];
    var i,j;
    for(i=0; i<nodes.length; i++){
        var flag = false;
        for(j=0; j<toRemove.length; j++){
            if(nodes[i] === toRemove[j])
                flag = true;
        }
        if(!flag){
            changed.push(nodes[i]);
        }
    }
    nodes = changed;
}

function getBlock(name){
    var i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i];
    }
    return null;
}

function editBlocks(toMerge){
    var i;
    var toKeep = getBlock(toMerge[0]);
    var labels = getBlockLabel(toKeep.name) + '\n';
    for(i=1; i<toMerge.length; i++){
        labels += getBlockLabel(toMerge[i]) + '\n';
    }

    var newBlocks = [];
    for(i=0; i<blocks.length; i++){
        if(toMerge.indexOf(blocks[i].name) > -1){
            if(blocks[i].name === toKeep.name) {
                blocks[i].str = labels;
                newBlocks.push(blocks[i]);
            }
        }
        else
            newBlocks.push(blocks[i]);
    }
    blocks = newBlocks;
    return toKeep.name;
}

function createTransitionsFromLast(last, from){
    var i;
    for(i=0; i<transitions.length; i++){
        if(transitions[i].from === last){
            transitions[i].from = from;
        }
    }

}

function checkIfTwoNodesCanBeMerged(node1, node2){
    var okTypes = ['AssignmentExpression', 'VariableDeclaration', 'VariableDeclarator'];
    var type1 = getNodeType(node1);
    var type2 = getNodeType(node2);
    var index1 = okTypes.indexOf(type1);
    var index2 = okTypes.indexOf(type2);
    return index1> -1 &&  index2 > -1;
}


function performMerge(toMerge, transitionsToRemove){
    if(toMerge.length > 0){
        toMerge = toMerge.filter((v,i) => toMerge.indexOf(v) === i);
        removeNodes(toMerge.filter((v) => toMerge.indexOf(v) > 0));
        var newFrom = editBlocks(toMerge);
        removeTransitions(transitionsToRemove);
        createTransitionsFromLast(toMerge[toMerge.length-1], newFrom);
    }
}


function mergeNodesWithAssignmentOrDecl(){
    var transitionsToRemove = [];
    var i=0, toMerge = [], curr;
    var transitionCopy = transitions.slice();
    while(i<transitionCopy.length){
        curr = transitionCopy[i];
        if(checkIfTwoNodesCanBeMerged(curr.from, curr.to)){
            toMerge.push(curr.from);
            toMerge.push(curr.to);
            transitionsToRemove.push(curr);
        }
        else{
            performMerge(toMerge, transitionsToRemove);
            toMerge = [];
            transitionsToRemove = [];
        }
        i++;
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
        var toAdd = '';
        if(split2[1].includes('true'))
            toAdd =' true';
        else if(split2[1].includes('false'))
            toAdd =' false';
        blocksAndTrans.push(split2[0] += toAdd);
    }
    return blocksAndTrans;
}

function addProperties(){
    var i;
    for(i=0; i<blocks.length; i++){
        var label = blocks[i].str;
        var color = blocks[i].color;
        if(blocks[i].type === 'Merge') {
            nodes[i] += '[label="'+ label + '" color='+color+' style=filled  shape=oval';
        }
        else {
            nodes[i] += '[label="' + (i + 1) + '\n' + label + '" color=' + color + ' style=filled';
            if (blocks[i].type === 'BinaryExpression') {
                nodes[i] += ' shape=diamond';
            } else {
                nodes[i] += ' shape=rectangle';
            }
        }
    }
}


function addNodeAndTransitions(toArray, index){
    var returnValues = {nodes:[], transitions:[], toRemove:[]}, i, transition;
    for(var key in toArray){
        var froms = toArray[key];
        if(froms.length > 1){
            var nodeName = 'n'+ index;
            var block = {name: nodeName, type:'Merge', str:'', color:'green'};
            blocks.push(block);
            index++;
            returnValues.nodes.push(nodeName);
            for(i=0; i<froms.length; i++){
                transition = {from: froms[i], to:nodeName};
                returnValues.transitions.push(transition);
                returnValues.toRemove.push({from: froms[i], to:key});
            }
            transition = {from: nodeName, to:key};
            returnValues.transitions.push(transition);
        }
    }
    return returnValues;

}

function findNewNodeIndex(){
    var last = nodes[nodes.length - 1];
    return Number(last.substring(1))+1;
}

function addMergePoints(){
    var i;

    var toArray = {};
    for(i=0; i<transitions.length; i++){
        var fromNode = transitions[i].from;
        var toNode = transitions[i].to;
        if(toArray[toNode] === undefined){
            toArray[toNode] = [fromNode];
        }
        else{
            toArray[toNode].push(fromNode);
        }
    }
    var index = findNewNodeIndex();
    return addNodeAndTransitions(toArray, index);

}


function addNodes(toAdd){
    var i;
    for(i=0; i<toAdd.length; i++){
        nodes.push(toAdd[i]);
    }
}

function transitionsEquals(t1, t2){
    return t1.from === t2.from && t1.to === t2.to;
}

function removeTransitions(toRemove){
    var changed = [];
    var i,j;
    for(i=0; i<transitions.length; i++){
        var flag = false;
        for(j=0; j<toRemove.length; j++){
            if(transitionsEquals(transitions[i], toRemove[j]))
                flag = true;
        }
        if(!flag){
            changed.push(transitions[i]);
        }
    }
    transitions =  changed;

}

function addTransitions(toAdd){
    var i;
    for(i=0; i<toAdd.length; i++){
        transitions.push(toAdd[i]);
    }
    return transitions;

}

function setTransitions(startIndex, blocksAndTrans){
    var i;
    for(i=startIndex; i<blocksAndTrans.length; i++){
        var splitted = blocksAndTrans[i].split(' -> ');
        var from = splitted[0];
        var to = splitted[1].substring(0,2);
        var label = splitted[1].substring(3);
        transitions.push({from: from, to:to, label:label});
    }
}

function createFlowChart(functionBody){
    const cfg = esgraph(functionBody)[2];
    const graph = esgraph.dot(esgraph(functionBody), { counter: 0});
    var i;

    for(i=1; i<cfg.length-1; i++){
        var block = {name: 'n'+i, type: cfg[i].astNode.type, str: findStringRepresentation(cfg[i].astNode), color: cfg[i].astNode.color};
        blocks.push(block);
    }
    var blocksAndTrans = editTags(graph);
    blocksAndTrans = removeStartAndEnd(blocksAndTrans, blocks.length+1);
    for(i=0; i<blocks.length; i++){
        nodes.push(blocksAndTrans[i]);
    }
    setTransitions(blocks.length, blocksAndTrans);
    // for(i=blocks.length; i<blocksAndTrans.length; i++){
    //     var splitted = blocksAndTrans[i].split(' -> ');
    //     var from = splitted[0];
    //     var to = splitted[1].substring(0,2);
    //     transitions.push({from: from, to:to});
    // }

    mergeNodesWithAssignmentOrDecl();
    var changes= addMergePoints();
    addNodes(changes.nodes);
    removeTransitions(changes.toRemove);
    addTransitions(changes.transitions);
    addProperties();
    return Viz('digraph {' + concatToGraph() + '}');
}


export {createFlowChart, restartGraphCreation};

