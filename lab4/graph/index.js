// create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
]);

// create an array with edges
var edges = new vis.DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
]);

// create a network
var container = document.getElementById("chart-1");
var data = {
    nodes: nodes,
    edges: edges,
};
var options = {
    nodes: {
        shape: "dot",
        size: 30,
        font: {
            size: 32,
            color: "#ffffff",
        },
        borderWidth: 2,
    },
    edges: {
        width: 2,
    },
};
var network = new vis.Network(container, data, options);
