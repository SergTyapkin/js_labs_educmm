'use strict';

/**
 * @param vector{number[]}
 */
export function vectorLength(vector) {
    let squareSum = 0;
    vector.forEach((num) => {
        squareSum += num * num;
    });
    return Math.sqrt(squareSum);
}

/**
 * @param A{number[]}
 * @param B{number[]}
 */
export function scalarProduct(A, B) {
    let sum = 0;
    A.forEach((a, idx) => {
        const b = B[idx];
        sum += a * b;
    });
    return sum;
}

export function transposeMatrix(A) {
    const m = A.length, n = A[0].length, AT = [];
    for (let i = 0; i < n; i++) {
        AT[i] = [];
        for (let j = 0; j < m; j++)
            AT[i][j] = A[j][i];
    }
    return AT;
}

export function multiplyMatrix(A, B) {
    const rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA !== rowsB) return false;
    for (let i = 0; i < rowsA; i++)
        C[ i ] = [];
    for (let k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            let t = 0;
            for (let j = 0; j < rowsB; j++)
                t += A[ i ][j]*B[j][k];
            C[ i ][k] = t;
        }
    }
    return C;
}
