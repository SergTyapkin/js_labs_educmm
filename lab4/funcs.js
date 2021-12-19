'use strict';
import {CORSRequest} from "./CORSRequest.js"
import {transposeMatrix} from "./matrixMath.js";

function avg(list) {
    return list.reduce((sum, num) => sum + num) / list.length;
}

/**
 * Ковариация от списков значений двух случайных величин
 * cov(X, Y) = <X * Y> - XY
 * @param X {number[]}
 * @param Y {number[]}
 * @param avgX {number}
 * @param avgY {number}
 */
export function covariation(X, Y, avgX = undefined, avgY = undefined) {
    if (avgX === undefined)
        avgX = avg(X);
    if (avgY === undefined)
        avgY = avg(Y);

    let multiply = 0;
    X.forEach((xCur, idx) => {
        const yCur = Y[idx];
        multiply += (avgX - xCur) * (avgY - yCur);
    });
    return multiply / (X.length - 1);
}

/**
 * Масштабирует матрицу
 * @param matrix {Array<number[]>}
 */
export function scaling(matrix) {
    const avgs = matrix.map(avg);
    const matrixOut = [];
    matrix.forEach((string, idx) => {
        const curStd = std(string, avgs[idx]);
        matrixOut.push([]);
        string.forEach((elem, idxElem) => {
            matrixOut[idx].push((elem - avgs[idx]) / curStd);
        });
    });

    return matrixOut;
}

/**
 * Ковариация от списков значений двух случайных величин
 * cov(X, Y) = <X * Y> - XY
 * @param X {number[]}
 * @param Y {number[]}
 * @param avgX {number}
 * @param avgY {number}
 */
export function corellation(X, Y, avgX = undefined, avgY = undefined) {
    if (avgX === undefined)
        avgX = avg(X);
    if (avgY === undefined)
        avgY = avg(Y);

    let cov = 0, stdX = 0, stdY = 0;
    X.forEach((xCur, idx) => {
        const yCur = Y[idx];
        const dx = (avgX - xCur);
        const dy = (avgY - yCur);
        cov += dx * dy;
        stdX += dx * dx;
        stdY += dy * dy
    });
    return cov / Math.sqrt(stdX * stdY);
}

/**
 * Стандартное отклонение от списка значений N переменных
 * @param list {number[]}
 * @param avgNum {number}
 */
export function std(list, avgNum = undefined) {
    return Math.sqrt(disperse(list, avgNum));
}

/**
 * Дисперсия от списка значений N переменных
 * @param list {number[]}
 * @param avgNum {number}
 */
export function disperse(list, avgNum = undefined) {
    if (avgNum === undefined)
        avgNum = avg(list);

    let multiply = 0;
    list.forEach((cur) => {
        const d = avgNum - cur;
        multiply += d * d;
    });
    return multiply / (list.length - 1);
}

/**
 * @param var_lists {Array<number[]>}
 * @param foo {Function}
 */
export function mapMatrix(var_lists, foo) {
    const avgs = var_lists.map(avg);
    const matrix = [];
    var_lists.forEach((list1, idx1) => {
        const string = [];
        var_lists.forEach((list2, idx2) => {
            string.push(foo(list1, list2, avgs[idx1], avgs[idx2]));
        });
        matrix.push(string.concat());
    });
    return matrix;
}

/**
 * @param var_lists {Array<number[]>}
 * @param foo {Function}
 */
export function mapMatrixSingle(var_lists, foo) {
    const avgs = var_lists.map(avg);
    const list = [];
    var_lists.forEach((string, idx) => {
        list.push(foo(string, avgs[idx]));
    });
    return list;
}


const APIUrl = "https://educmm-lab4-backend.herokuapp.com/"
/**
 * Нахождение собственных векторов и значений матрицы
 * Алгоритм я пока написать не смог, так что взял результаты работы функции numpy.linlg.eig из python.
 * Использовано API, раздающее результаты работы этой функции
 * @param matrix {Array<number[]>}
 */
export async function eigen(matrix) {
    const url = APIUrl + "eig";
    const response = await CORSRequest(url, 'POST', JSON.stringify({"matrix": matrix}));

    if (!response.ok)
        throw ReferenceError(url + " returned error code: " + response.status);
    const data = await response.json();
    return [data.values, data.vectors];
}

/**
 * Сингулярное разложение матрицы
 * numpy.linlg.svd из python.
 * @param matrix {Array<number[]>}
 */
export async function singular(matrix) {
    const url = APIUrl + "svd";
    const response = await CORSRequest(url, 'POST', JSON.stringify({"matrix": matrix}));

    if (!response.ok)
        throw ReferenceError(url + " returned error code: " + response.status);
    const data = await response.json();
    return [data.left, data.values, data.right];
}

/**
 * Выполняет поиск главных компонент матрицы и сортирует их
 * @param matrix {Array<number[]>}
 */
export async function PCA(matrix) {
    // Получение собственных векторов - базисов
    let [eigValues, eigVectors] = await eigen(matrix);
    eigVectors = transposeMatrix(eigVectors);

// Сортировка векторов по собственным значениям
    eigVectors.forEach((vector, idx) => {
        vector.eigValue = eigValues[idx];
    });
    eigValues.sort((a, b) => b - a);
    eigVectors.sort((A, B) => {
        return B.eigValue - A.eigValue;
    });

    const stds = [];
    const divider = eigValues.length - 1;
    eigValues.forEach((val) => {
        stds.push(Math.sqrt(val / divider));
    });
    return [eigValues, eigVectors, stds];
}
