'use strict';

import * as mxMath from "./matrixMath.js";

export function qubicSplineCoeff(xNodes, yNodes) {
    const n = xNodes.length;

    function h(idx) {
        return xNodes[idx] - xNodes[idx - 1];
    }
    function a(idx) {
        return yNodes[idx - 1];
    }

    // Create matrix
    const matrix = [];
    const zeroString = [];
    for (let i = 0; i < n; i++) {
        zeroString.push(0);
    }
    matrix.push(zeroString.concat());
    matrix[0][0] = 1;
    for (let i = 1; i < n - 1; i++) {
        matrix.push([]);
        for (let c = 0; c < n; c++) {
            let curNum = 0;
            if (c === i - 1) {
                curNum = h(i);
            } else if (c === i) {
                curNum = 2 * (h(i) + h(i + 1));
            } else if (c === i + 1) {
                curNum = h(i + 1);
            }
            matrix[i].push(curNum);
        }
    }
    matrix.push(zeroString.concat());
    matrix[n-1][n-1] = 1;

    // Create vector
    const vector = [[0]];
    for (let i = 1; i < n - 1; i++) {
        vector.push([3 / h(i + 1) * (a(i + 2) - a(i + 1))  -  3 / h(i) * (a(i + 1) - a(i))]);
    }
    vector.push([0]);

    // Find result vectors
    //console.log('Vectors:');
    const listOfA = yNodes.concat();
    const listOfC = mxMath.transMatrix(mxMath.multiplyMatrix(mxMath.inverseMatrix(matrix), vector))[0];
    //console.log(listOfC);
    const listOfB = [];
    for (let i = 1; i < n; i++) {
        listOfB.push(1 / h(i) * (a(i + 1) - a(i)) - h(i) / 3 * (listOfC[i] + 2 * listOfC[i - 1]));
    }
    //console.log(listOfB);
    const listOfD = [];
    for (let i = 0; i < n - 1; i++) {
        listOfD[i] = (listOfC[i + 1] - listOfC[i]) / (3 * h(i + 1));
    }
    //console.log(listOfD);
    listOfA.pop();
    listOfC.pop();

    return {
        listOfA: listOfA,
        listOfB: listOfB,
        listOfC: listOfC,
        listOfD: listOfD
    }
}

function getQubicSplineCoeffs(x, xNodes, { listOfA, listOfB, listOfC, listOfD }) {
    // find index of spline coefficients
    let idx;
    if (x >= xNodes[xNodes.length - 1]) {
        idx = xNodes.length - 2;
    } else if (x <= xNodes[0]) {
        idx = 0;
    } else {
        xNodes.forEach((curX, curIdx) => {
            if (curX >= x && idx === undefined) {
                idx = curIdx - 1;
            }
        });
    }

    const dx = x - xNodes[idx];
    return {a: listOfA[idx], b: listOfB[idx], c: listOfC[idx], d: listOfD[idx], x: dx};
}
export function qibicSpline(absX, xNodes, coeffsLists) {
    const {a, b, c, d, x} = getQubicSplineCoeffs(absX, xNodes, coeffsLists);
    return a + b * x + c * x * x + d * x * x * x;
}
export function dQibicSpline(absX, xNodes, coeffsLists) {
    const {a, b, c, d, x} = getQubicSplineCoeffs(absX, xNodes, coeffsLists);
    return b + 2 * c * x + 3 * d * x * x;
}
