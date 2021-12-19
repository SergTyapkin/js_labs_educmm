import {compressDataToHeatmap, compressDataToBubble, compressDataToMsline} from "../../utils.js";
import {corellation, covariation, eigen, mapMatrix} from "../../funcs.js";
import {scalarProduct, transposeMatrix, vectorLength, multiplyMatrix} from "../../matrixMath.js";
import {laplacian} from "../graphUtils.js";
import {G3 as G3_all} from "../data3.js";
import {G1, G2} from "../data1_2.js";

// Делаем из 1000х1000 -> 100х100
const G3 = [];
const reduceStrength = 10;
for (let i = 0; i < G3_all.length; i += reduceStrength) {
    const string = [];
    for (let c = 0; c < G3_all[0].length; c += reduceStrength) {
        string.push(G3_all[i][c]);
    }
    G3.push(string.concat());
}

// Create a JSON object to store the chart configurations
const chartDataConfig = {
    caption: "",
    subCaption: "",
    xAxisName: "",
    yAxisName: "",
    numberSuffix: "",
    theme: "candy",
    lineThickness: "2",
    captionFont: "sans-serif",
    subCaptionFont: "sans-serif",
    labelFontColor: "#999ca5",
    yAxisNameFontColor: "#999ca5",
}

const graphId = +(new URL(location.toString())).searchParams.get("graph")
let matrix;
switch (graphId) {
    case 1:
        matrix = G1;
        break;
    case 2:
        matrix = G2;
        break;
    case 3:
        matrix = G3;
        break;

    default:
        location.href = ".."
}

// Получение лапласиана
const lapMatrix = laplacian(matrix);

// Получение его собственных векторов и значений
let [lapEigValues, lapEigVectors] = await eigen(lapMatrix);
lapEigVectors = transposeMatrix(lapEigVectors);
console.log(lapMatrix);
console.log(lapEigValues, lapEigVectors);

// Сортировка векторов по собственным значениям
lapEigVectors.forEach((vector, idx) => {
    vector.eigValue = lapEigValues[idx];
});
lapEigValues.sort((a, b) => b - a);
lapEigVectors.sort((A, B) => {
    return B.eigValue - A.eigValue;
});

console.log("SORTED");
console.log(lapMatrix);
console.log(lapEigValues);
console.log(lapEigVectors);

// Находим вектор Фидлера
const fidlerVal = lapEigVectors.length - 2;
const fidlerVector = lapEigVectors[fidlerVal];
const sortedFidlerVector = fidlerVector.concat();
sortedFidlerVector.sort((a, b) => b - a);
// Проецирование векторов на вектор Фидлера
const fidlerProection = transposeMatrix(multiplyMatrix(matrix, transposeMatrix([sortedFidlerVector])))[0];

// Копирование матрицы смежности и сопоставление вектору Фидлера
const sortedMatrix = matrix.concat();
sortedMatrix.forEach((string, i) => {
    sortedMatrix[i] = string.concat();
    sortedMatrix[i].forEach((elem, idx) => {
        sortedMatrix[i][idx] = {
            adjValue: elem,
            value: fidlerVector[idx],
        };
    });
    sortedMatrix[i].value = fidlerVector[i];
});

// Сортировка матрицы смежности в соответствии с вектором Фидлера.
sortedMatrix.forEach((string) => {string.sort((a, b) => a.value - b.value);});
sortedMatrix.sort((a, b) => a.value - b.value);

// Конвертация элементов обратно в числа
sortedMatrix.forEach((string, i) => {
    string.forEach((elem, idx) => {
        sortedMatrix[i][idx] = elem.adjValue;
    });
});

// Создание конфигов для графиков на основе обработанных данных
const adjConfig = compressDataToHeatmap(matrix, chartDataConfig);
const lapConfig = compressDataToHeatmap(lapMatrix, chartDataConfig);
const valConfig = compressDataToMsline(undefined, [lapEigValues], ["eigen values"], chartDataConfig);
const proectionOn2Config = compressDataToMsline(undefined, [fidlerProection], ["proection on 2nd vector"], chartDataConfig);
const proectionConfig = compressDataToBubble(fidlerVector, [fidlerProection], chartDataConfig);
const sortedAbjConfig = compressDataToHeatmap(sortedMatrix, chartDataConfig);

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

    chart.setJSONData(lapConfig);
    chart.render();
});

// Обработчики для кнопок
const adjButton = document.getElementById("adj");
const lapButton = document.getElementById("lap");
const valButton = document.getElementById("val");
const proectionOn2Button = document.getElementById("proectionOn2");
const proectionButton = document.getElementById("proection");
const sortedAdjButton = document.getElementById("sortAdj");
const buttons = [adjButton, lapButton, valButton, proectionOn2Button, proectionButton, sortedAdjButton];

adjButton.addEventListener("click", () => {
    chart.chartType("heatmap");
    chart.setJSONData(adjConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    adjButton.classList.add("active");
});
lapButton.addEventListener("click", () => {
    chart.chartType("heatmap");
    chart.setJSONData(lapConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    lapButton.classList.add("active");
});
valButton.addEventListener("click", () => {
    chart.chartType("msline");
    chart.setJSONData(valConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    valButton.classList.add("active");
});
proectionOn2Button.addEventListener("click", () => {
    chart.chartType("msline");
    chart.setJSONData(proectionOn2Config);
    buttons.forEach((button) => button.classList.remove("active"));
    proectionOn2Button.classList.add("active");
});
proectionButton.addEventListener("click", () => {
    chart.chartType("bubble");
    chart.setJSONData(proectionConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    proectionButton.classList.add("active");
});
sortedAdjButton.addEventListener("click", () => {
    chart.chartType("heatmap");
    chart.setJSONData(sortedAbjConfig);
    buttons.forEach((button) => button.classList.remove("active"));
    sortedAdjButton.classList.add("active");
});
