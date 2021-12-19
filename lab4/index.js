import {compressDataToHeatmap, compressDataToBubble, compressDataToMsline} from "./utils.js";
import {corellation, covariation, disperse, scaling, eigen, mapMatrix, mapMatrixSingle, PCA, std} from "./funcs.js";
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
console.log("MATRIX");
console.log(matrix);

// Масштабирование матрицы
const A = transposeMatrix(scaling(matrix));
console.log("SCALED");
console.log(A);

// Матрица Грама
const squaredA = multiplyMatrix(transposeMatrix(A), A);
// Получение гравных компонент
let [eigValues, eigVectors, stds] = await PCA(squaredA);

// Получение матрицы коэффициентов корелляции/ковариации
const corMatrix = mapMatrix(matrix, corellation);
const covMatrix = mapMatrix(matrix, covariation);

// Получение отсортированных главных компонент
//let [eigValues, eigVectors, stds] = await PCA(corMatrix);

// Проецирование векторов на базисы и разбиение точек по двум классам
const proectionMatrix = multiplyMatrix(A, transposeMatrix(eigVectors));

// Разделение полученных проекций по двум классам
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
});

// Создание конфигов для графиков на основе обработанных данных
const covConfig = compressDataToHeatmap(covMatrix, chartDataConfig);
const corConfig = compressDataToHeatmap(corMatrix, chartDataConfig);
const stdConfig = compressDataToMsline(undefined, [stds], ["стандартные отклонения"], chartDataConfig);
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
const stdButton = document.getElementById("std");
const proectionButton = document.getElementById("proection");
const graphButton = document.getElementById("graph");
const buttons = [covButton, corButton, stdButton, proectionButton];

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
stdButton.addEventListener("click", () => {
    chart.chartType("msline");
    chart.setJSONData(stdConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    stdButton.classList.add("active");
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
