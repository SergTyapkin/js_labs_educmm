import {compressDataToHeatmap, compressDataToBubble, compressDataToMsline, compressDataToDragNode, getArray, getRandom, getRandomArray} from "./utils.js";
import {corellation, covariation, disperse, ditch, eigen, mapMatrix, mapMatrixSingle, std} from "./funcs.js";
import {data} from "./data.js";
import {scalarProduct, transposeMatrix, vectorLength, multiplyMatrix} from "./matrixMath.js";


// Create a JSON object to store the chart configurations
const chartDataConfig = {
    // caption: "Длины проекций векторов начальных данных",
    // subCaption: "для 569 векторов",
    // xAxisName: "Проекция на 1-ый базис",
    // yAxisName: "Проекция на 2-ой базис",
    numberSuffix: "",
    theme: "candy",
    lineThickness: "2",
    captionFont: "sans-serif",
    subCaptionFont: "sans-serif",
    labelFontColor: "#999ca5",
    yAxisNameFontColor: "#999ca5",
}
// Отделение диагнозов от матрицы измерений
const diags = [];
data.forEach((string) => diags.push(string.shift()));

// Транспонирование матрицы
const matrix = transposeMatrix(data);
const vectors = data;
console.log("MATRIX/VECTORS")
console.log(matrix);
console.log(vectors);

// Получение матрицы коэффициентов корелляции
const covMatrix = mapMatrix(matrix, covariation);
const corMatrix = mapMatrix(matrix, corellation);
const A = transposeMatrix(ditch(matrix));

console.log("COV/COR")
console.log(covMatrix);
console.log(corMatrix);
console.log(A);


// Получение собственных векторов - базисов
let [eigValues, eigVectors] = await eigen(corMatrix);
eigVectors = transposeMatrix(eigVectors);
console.log("EIG VAL/VEC")
console.log(eigValues);
console.log(eigVectors);

// Сортировка векторов по собственным значениям
eigVectors.forEach((vector, idx) => {
    vector.eigValue = eigValues[idx];
});
eigValues.sort((a, b) => b - a);
eigVectors.sort((A, B) => {
    return B.eigValue - A.eigValue;
});

console.log("EIG VAL/VEC SORTED")
console.log(eigValues);
console.log(eigVectors);

// Проецирование векторов на базисы и разбиение точек по двум классам
eigVectors = transposeMatrix(eigVectors);
const proectionMatrix = multiplyMatrix(A, eigVectors);

console.log("PROECTIONS")
console.log(A);
console.log(eigVectors);
console.log(proectionMatrix);

const xValues = [];
const yValues = [[], []];
proectionMatrix.forEach((string, idx) => {
    xValues.push(string[0]);
    if (diags[idx] === 1) {
        yValues[0].push(string[1]);
        yValues[1].push(undefined);
    } else {
        yValues[0].push(undefined);
        yValues[1].push(string[1]);
    }
    console.log(string[0], string[1]);
});

// Создание конфигов для графиков на основе обработанных данных
const covConfig = compressDataToHeatmap(covMatrix, chartDataConfig);
const corConfig = compressDataToHeatmap(corMatrix, chartDataConfig);
const proectionConfig = compressDataToBubble(xValues, yValues, chartDataConfig, ["M", "B"], ["#34e337", "#ea3de4"]);

let chart;

FusionCharts.ready(() => {
    chart = new FusionCharts({
        type: "heatmap",
        renderAt: "chart-1",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource: undefined,
    });

    chart.setJSONData(corConfig);
    chart.render();
});

// Обработчики для кнопок
const covButton = document.getElementById("cov");
const corButton = document.getElementById("cor");
const proectionButton = document.getElementById("proection");
const graphButton = document.getElementById("graph");
const buttons = [covButton, corButton, proectionButton];

covButton.addEventListener("click", () => {
    chart.chartType("heatmap");
    chart.setJSONData(covConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    covButton.classList.add("active");
});
corButton.addEventListener("click", () => {
    chart.chartType("heatmap");
    chart.setJSONData(corConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    corButton.classList.add("active");
});
proectionButton.addEventListener("click", () => {
    chart.chartType("bubble");
    chart.setJSONData(proectionConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    proectionButton.classList.add("active");
});
graphButton.addEventListener("click", () => {
    location.href = './graph/'
});
