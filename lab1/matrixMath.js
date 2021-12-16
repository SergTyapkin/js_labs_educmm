'use strict';

export function transMatrix(A) {
    const m = A.length, n = A[0].length, AT = [];
    for (let i = 0; i < n; i++)
    { AT[ i ] = [];
        for (let j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
    }
    return AT;
}

export function multiplyMatrix(A,B) {
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

function determinant(A)   // Используется алгоритм Барейса, сложность O(n^3)
{
    let N = A.length, B = [], denom = 1, exchanges = 0;
    for (let i = 0; i < N; ++i)
    { B[ i ] = [];
        for (let j = 0; j < N; ++j) B[ i ][j] = A[ i ][j];
    }
    for (let i = 0; i < N-1; ++i)
    { let maxN = i, maxValue = Math.abs(B[ i ][ i ]);
        for (let j = i+1; j < N; ++j)
        { let value = Math.abs(B[j][ i ]);
            if (value > maxValue){ maxN = j; maxValue = value; }
        }
        if (maxN > i)
        { let temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp;
            ++exchanges;
        }
        else { if (maxValue === 0) return maxValue; }
        let value1 = B[ i ][ i ];
        for (let j = i+1; j < N; ++j)
        { let value2 = B[j][ i ];
            B[j][ i ] = 0;
            for (let k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[ i ][k]*value2)/denom;
        }
        denom = value1;
    }
    if (exchanges % 2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}

function adjugateMatrix(A) { // А - КВАДРАТНЫЙ двумерный массив
    let N = A.length, adjA = [];
    for (let i = 0; i < N; i++)
    { adjA[ i ] = [];
        for (let j = 0; j < N; j++)
        { let B = [], sign = ((i + j)%2 === 0) ? 1 : -1;
            for (let m = 0; m < j; m++)
            { B[m] = [];
                for (let n = 0; n < i; n++)   B[m][n] = A[m][n];
                for (let n = i+1; n < N; n++) B[m][n-1] = A[m][n];
            }
            for (let m = j+1; m < N; m++)
            { B[m-1] = [];
                for (let n = 0; n < i; n++)   B[m-1][n] = A[m][n];
                for (let n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
            }
            adjA[ i ][j] = sign * determinant(B);
        }
    }
    return adjA;
}

export function inverseMatrix(A) { // А - КВАДРАТНЫЙ двумерный массив
    const det = determinant(A);
    if (det === 0) return false;
    const N = A.length;
    A = adjugateMatrix(A);
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++)
            A[ i ][j] /= det;
    }
    return A;
}
