import {findStringRepresentation} from './strings';

const esgraph = require('esgraph');


let transitions = [];
let nodes = [];
let blocks = [];


let classFunctions = {
    'getBlockLabel':getBlockLabel,
    'removeStartAndEnd':removeStartAndEnd,
    'concatToGraph': concatToGraph,
    'getNodeType': getNodeType,
    'removeNodes': removeNodes,
    'getBlock': getBlock,
    'editBlocks': editBlocks,
    'createTransitionsFromLast': createTransitionsFromLast,
    'checkIfTwoNodesCanBeMerged': checkIfTwoNodesCanBeMerged,
    'performMerge': performMerge,
    'mergeNodesWithAssignmentOrDecl': mergeNodesWithAssignmentOrDecl,
    'editTags': editTags,
    'addProperties': addProperties,
    'addNodeAndTransitions': addNodeAndTransitions,
    'findNewNodeIndex': findNewNodeIndex,
    'addMergePoints': addMergePoints,
    'addNodes': addNodes,
    'transitionsEquals': transitionsEquals,
    'removeTransitions': removeTransitions,
    'addTransitions': addTransitions,
    'setTransitionsFromBlocksAndTrans': setTransitionsFromBlocksAndTrans,
    'createFlowChart': createFlowChart

};

let getterAndSetters = {
    'getTransitions': getTransitions,
    'setTransitions': setTransitions,
    'getNodes': getNodes,
    'setNodes': setNodes,
    'getBlocks': getBlocks,
    'setBlocks': setBlocks
};

function getOrSet(functionName, params){
    return getterAndSetters[functionName].apply(null, params);
}

function getTransitions(){
    return transitions;
}
function setTransitions(trans){
    transitions = trans;
}
function getNodes(){
    return nodes;
}
function setNodes(nodesToSet){
    nodes = nodesToSet;
}
function getBlocks(){
    return blocks;
}
function setBlocks(blocksToSet){
    blocks = blocksToSet;
}

function testFunction(functionName, params){
    return classFunctions[functionName].apply(null, params);
}


function restartGraphCreation(){
    transitions = [];
    nodes = [];
    blocks = [];
}

////////////////////////////////////////////

function getBlockLabel(name){
    let i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i].str;
    }
    return '';
}

function removeStartAndEnd(blocksAndTrans, numOfBlocks){
    let start = blocksAndTrans[0].split('[')[0];
    let end = blocksAndTrans[numOfBlocks].split('[')[0];
    let ret = [], i;

    for(i=1; i<blocksAndTrans.length; i++){
        if(!blocksAndTrans[i].includes(start) && !blocksAndTrans[i].includes(end)){
            ret.push(blocksAndTrans[i]);
        }
    }

    return ret;
}

function concatToGraph(){
    let graph = '', i;
    for(i=0; i<nodes.length; i++){
        graph += nodes[i]+' fontname=tahoma]\n';
    }
    for(i=0; i<transitions.length; i++){
        let label = transitions[i].label;
        if(label === '')
            label = '""';
        let transition = transitions[i].from + ' -> ' + transitions[i].to + ' [label='+label;
        graph += transition+' fontname=tahoma]\n';
    }
    return graph;
}


function getNodeType(name){
    let i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i].type;
    }
    return '';
}

function removeNodes(toRemove){
    let changed = [];
    let j, i;
    for(i=0; i<nodes.length; i++){
        let flag = false;
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
    let i;
    for(i=0; i<blocks.length; i++){
        if(blocks[i].name === name)
            return blocks[i];
    }
    return null;
}

function editBlocks(toMerge){
    let toKeep = getBlock(toMerge[0]);
    let labels = getBlockLabel(toKeep.name) + '\n';
    let i;
    for(i=1; i<toMerge.length; i++){
        labels += getBlockLabel(toMerge[i]) + '\n';
    }

    let newBlocks = [];
    for(i=0; i<blocks.length; i++){
        if(toMerge.indexOf(blocks[i].name) > -1){
            if(blocks[i].name === toKeep.name) {
                blocks[i].str = labels;
                newBlocks.push(blocks[i]);}
        }
        else newBlocks.push(blocks[i]);
    }
    blocks = newBlocks;
    return toKeep.name;
}

function createTransitionsFromLast(last, from){
    let i;
    for(i=0; i<transitions.length; i++){
        if(transitions[i].from === last){
            transitions[i].from = from;
        }
    }

}

function checkIfTwoNodesCanBeMerged(node1, node2){
    let okTypes = ['AssignmentExpression', 'VariableDeclaration', 'VariableDeclarator', 'UpdateExpression'];
    let type1 = getNodeType(node1);
    let type2 = getNodeType(node2);
    let index1 = okTypes.indexOf(type1);
    let index2 = okTypes.indexOf(type2);
    return index1> -1 &&  index2 > -1;
}


function performMerge(toMerge, transitionsToRemove){
    if(toMerge.length > 0){
        toMerge = toMerge.filter((v,i) => toMerge.indexOf(v) === i);
        removeNodes(toMerge.filter((v) => toMerge.indexOf(v) > 0));
        let newFrom = editBlocks(toMerge);
        removeTransitions(transitionsToRemove);
        createTransitionsFromLast(toMerge[toMerge.length-1], newFrom);
    }
}


function mergeNodesWithAssignmentOrDecl(){
    let transitionsToRemove = [];
    let toMerge = [], curr, i=0;
    let transitionCopy = transitions.slice();
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
    let split1 =graph.toLocaleString().split(']\n');
    let blocksAndTrans = [];
    let j;
    for(j=0; j<split1.length; j++){
        let split2  = split1[j].split(' [');
        if(split2[1] === undefined)
            continue;
        let toAdd = '';
        if(split2[1].includes('true'))
            toAdd =' true';
        else if(split2[1].includes('false'))
            toAdd =' false';
        blocksAndTrans.push(split2[0] += toAdd);
    }
    return blocksAndTrans;
}

function addProperties(){
    let i;
    for(i=0; i<blocks.length; i++){
        let label = blocks[i].str;
        let color = blocks[i].color;
        if(blocks[i].type === 'Merge') {
            nodes[i] += '[label="'+ label + '" color='+color+' style=filled  shape=oval';
        }
        else {
            nodes[i] += '[label="((' + (i + 1) + '))\n' + label + '" color=' + color + ' style=filled';
            if (blocks[i].type === 'BinaryExpression') {
                nodes[i] += ' shape=diamond';
            } else {
                nodes[i] += ' shape=rectangle';
            }
        }
    }
}


function addNodeAndTransitions(toArray, index){
    let returnValues = {nodes:[], transitions:[], toRemove:[]}, i, transition;
    for(var key in toArray){
        let froms = toArray[key];
        if(froms.length > 1){
            let nodeName = 'n'+ index;
            let block = {name: nodeName, type:'Merge', str:'', color:'green'};
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
        }}return returnValues;

}

function findNewNodeIndex(){
    let last = nodes[nodes.length - 1];
    return Number(last.substring(1))+1;
}

function addMergePoints(){
    let toArray = {}, i;
    for(i=0; i<transitions.length; i++){
        let fromNode = transitions[i].from;
        let toNode = transitions[i].to;
        if(toArray[toNode] === undefined){
            toArray[toNode] = [fromNode];
        }
        else{
            toArray[toNode].push(fromNode);
        }
    }
    let index = findNewNodeIndex();
    return addNodeAndTransitions(toArray, index);

}


function addNodes(toAdd){
    let i;
    for(i=0; i<toAdd.length; i++){
        nodes.push(toAdd[i]);
    }
}

function transitionsEquals(t1, t2){
    return t1.from === t2.from && t1.to === t2.to;
}

function removeTransitions(toRemove){
    let changed = [];
    let j, i;
    for(i=0; i<transitions.length; i++){
        let flag = false;
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
    let i;
    for(i=0; i<toAdd.length; i++){
        transitions.push(toAdd[i]);
    }
    return transitions;

}

function setTransitionsFromBlocksAndTrans(startIndex, blocksAndTrans){
    let i;
    for(i=startIndex; i<blocksAndTrans.length; i++){
        let splitted = blocksAndTrans[i].split(' -> ');
        let from = splitted[0];
        let to = splitted[1].substring(0,2);
        let label = splitted[1].substring(3);
        transitions.push({from: from, to:to, label:label});
    }
}

function createFlowChart(functionBody){
    const cfg = esgraph(functionBody)[2];
    const graph = esgraph.dot(esgraph(functionBody), { counter: 0});
    for(let i=1; i<cfg.length-1; i++){
        let block = {name: 'n'+i, type: cfg[i].astNode.type, str: findStringRepresentation(cfg[i].astNode), color: cfg[i].astNode.color};
        blocks.push(block);}
    let blocksAndTrans = editTags(graph);
    blocksAndTrans = removeStartAndEnd(blocksAndTrans, blocks.length+1);
    for(let i=0; i<blocks.length; i++)
        nodes.push(blocksAndTrans[i]);
    setTransitionsFromBlocksAndTrans(blocks.length, blocksAndTrans);
    mergeNodesWithAssignmentOrDecl();
    let changes= addMergePoints();
    addNodes(changes.nodes);
    removeTransitions(changes.toRemove);
    addTransitions(changes.transitions);
    addProperties();
    return concatToGraph();

}


export {createFlowChart, restartGraphCreation, testFunction, getOrSet};

