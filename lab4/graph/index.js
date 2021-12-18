// create adjacency matrices of graphs
import {adjacencyMatrixToNodesEdges, generateCompleteGraph} from "./graphUtils.js";
import {G3} from "./data3.js";
import {G1, G2} from "./data1_2.js";

const G1Data = adjacencyMatrixToNodesEdges(G1);
const G2Data = adjacencyMatrixToNodesEdges(G2);
const G3Data = adjacencyMatrixToNodesEdges(G3);

// create a network
const container = document.getElementById("chart-1");
const options = {
    nodes: {
        shape: "dot",
        size: 30,
        borderWidth: 2,
        color: {
            border: '#3586f6',
            background: '#3a2869',
        },
        shadow: {
            enabled: true,
            color: 'black',
            size:10,
            x:5,
            y:5
        },
        font: {
            color: '#ffffff',
            size: 20,
        },
        icon: {
            face: "arial",
            size: 50,
            color: '#c5d4e8'
        },
    },
    edges: {
        width: 2,
        smooth: {
            enabled: true,
            type: 'dynamic',
        }
    },
    physics: {
        enabled: true,
        minVelocity: 0,
        wind: { x: 0.2, y: 0.2 }
    },
    layout: {
        randomSeed: undefined,
        improvedLayout: false
    }
};
var optionsG3 = {
    nodes: {
        shape: "dot",
        size: 30,
        borderWidth: 2,
        color: {
            border: '#3586f630',
            background: '#3a2869',
        },
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.5)',
            size:10,
            x:5,
            y:5
        },
        font: {
            color: '#ffffff',
            size: 20,
        },
        icon: {
            face: "arial",
            size: 50,
            color: '#c5d4e8'
        },
    },
    edges: {
        width: 0.1,
        smooth: {
            enabled: false,
            type: 'continuous'
        }
    },
    physics: {
        enabled: false,
        minVelocity: 0.5,
        adaptiveTimestep: true,
        barnesHut: {
            gravitationalConstant: -8000,
            springConstant: 0.04,
            springLength: 95
        },
        stabilization: {
            iterations: 987
        }
    },
    layout: {
        randomSeed: 191006,
        improvedLayout: false
    }
};
const graph = new vis.Network(container, G2Data, options);


// Обработчики для кнопок
const G1Button = document.getElementById("G1");
const G2Button = document.getElementById("G2");
const G3Button = document.getElementById("G3");
const matricesButton = document.getElementById("matrices");
const buttons = [G1Button, G2Button, G3Button];

let currentGraph = 2;
G1Button.addEventListener("click", () => {
    currentGraph = 1
    graph.setOptions(options);
    graph.setData(G1Data);
    buttons.forEach((button) => button.classList.remove("active"));
    G1Button.classList.add("active");
});
G2Button.addEventListener("click", () => {
    currentGraph = 2
    graph.setOptions(options);
    graph.setData(G2Data);
    buttons.forEach((button) => button.classList.remove("active"));
    G2Button.classList.add("active");
});
G3Button.addEventListener("click", () => {
    currentGraph = 3;
    graph.setOptions(optionsG3);
    graph.setData(G3Data);
    buttons.forEach((button) => button.classList.remove("active"));
    G3Button.classList.add("active");
});

matricesButton.addEventListener("click", () => {
    location.href = "./matrices/?graph=" + currentGraph;
});
