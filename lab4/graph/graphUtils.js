'use strict';

/**
 * Генерирует матрицу смежности полного графа
 * @param n {number}
 */
export function generateCompleteGraph(n) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
        matrix.push([]);
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                matrix[i].push(1);
            } else {
                matrix[i].push(0);
            }
        }
    }
    return matrix;
}

/**
 * Получает из матрицы смежности графа его узлы и рёбра
 * @param matrix {number[][]}
 */
export function adjacencyMatrixToNodesEdges(matrix) {
    const nodes = [];
    const edges = [];
    if (matrix.length !== matrix[0].length)
        throw RangeError("Matrix must have equal columns and rows count");

    matrix.forEach((string, stringIdx) => {
        nodes.push({
            id: stringIdx,
            icon: {code: `${stringIdx + 1}`},
        })
        for (let i = stringIdx; i < string.length; i++) {
            if (string[i]) {
               edges.push({
                   from: i,
                   to: stringIdx,
               })
            }
        }
    });
    return {
        nodes: nodes,
        edges: edges
    };
}

/**
 * Получает лапласиан
 * @param adjacencyMatrix {number[][]}
 */
export function laplacian(adjacencyMatrix) {
    if (adjacencyMatrix.length !== adjacencyMatrix[0].length)
        throw RangeError("Adjacency matrix must have equal columns and rows count");

    const laplacian = [];
    adjacencyMatrix.forEach((string, stringIdx) => {
        laplacian.push([]);
        let sum = 0;
        string.forEach((elem, elemIdx) => {
            laplacian[stringIdx].push(elem ? -elem: +elem);
            if (elemIdx !== stringIdx) {
                sum += elem;
            }
        });
        laplacian[stringIdx][stringIdx] += sum;
    });
    return laplacian;
}
