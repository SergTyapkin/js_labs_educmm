import {compressDataToHeatmap, compressDataToBubble, compressDataToDragNode, getArray, getRandom, getRandomArray} from "./utils.js";
import {corellation, covariation, eigen, mapMatrix} from "./funcs.js";
import {data} from "./data.js";
import {scalarProduct, transposeMatrix, vectorLength, multiplyMatrix} from "./matrixMath.js";


// Create a JSON object to store the chart configurations
const chartDataConfig = {
    caption: "Длины проекций векторов начальных данных",
    subCaption: "для 569 векторов",
    xAxisName: "Проекция на 1-ый базис",
    yAxisName: "Проекция на 2-ой базис",
    numberSuffix: "",
    theme: "candy",
    lineThickness: "2",
    captionFont: "sans-serif",
    subCaptionFont: "sans-serif",
    labelFontColor: "#999ca5",
    yAxisNameFontColor: "#999ca5",
}

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

// Отделение диагнозов от матрицы измерений
const diags = [];
data.forEach((string) => diags.push(string.shift()));

// Транспонирование матрицы
const matrix = transposeMatrix(data);
const vectors = data;

// Получение матрицы коэффициентов корелляции
const covMatrix = mapMatrix(matrix, covariation);
const corMatrix = mapMatrix(matrix, corellation);

// Получение собственных векторов - базисов
const [eigValues, eigVectors] = eigen(corMatrix);

// Сортировка векторов по собственным значениям
eigVectors.forEach((vector, idx) => {
    vector.eigValue = eigValues[idx];
});
eigVectors.sort((A, B) => {
    return A.eigValue - B.eigValue;
});

// Проецирование векторов на базисы и разбиение точек по двум классам
console.log(vectors.length, vectors[0].length)
console.log(corMatrix.length, corMatrix[0].length)
const proectionMatrix = multiplyMatrix(vectors, eigVectors);

const xValues = [];
const yValues = [[], []];
proectionMatrix.forEach((string, idx) => {
    xValues.push(string[0]);
    if (diags[idx] === 1) {
        yValues[0].push(string[1]);
    } else {
        yValues[1].push(string[1]);
    }
});

// Создание конфигов для графиков на основе обработанных данных
const covConfig = compressDataToHeatmap(covMatrix, chartDataConfig);
const corConfig = compressDataToHeatmap(corMatrix, chartDataConfig);
const proectionConfig = compressDataToBubble(xValues, yValues, chartDataConfig, ["M", "B"], ["#34e337", "#ea3de4"]);
const graphConfig = compressDataToDragNode(xValues, yValues, chartDataConfig, ["M", "B"], ["#34e337", "#ea3de4"]);

const covButton = document.getElementById("cov");
const corButton = document.getElementById("cor");
const proectionButton = document.getElementById("proection");
const graphButton = document.getElementById("graph");
const buttons = [covButton, corButton, proectionButton, graphButton];
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
