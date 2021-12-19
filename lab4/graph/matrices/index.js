import {compressDataToHeatmap, compressDataToBubble, compressDataToMsline} from "../../utils.js";
import {corellation, covariation, eigen, mapMatrix} from "../../funcs.js";
import {scalarProduct, transposeMatrix, vectorLength, multiplyMatrix} from "../../matrixMath.js";
import {laplacian} from "../graphUtils.js";
import {G3} from "../data3.js";
import {G1, G2} from "../data1_2.js";

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

// Проецирование векторов на базисы
console.log(lapEigVectors.length, lapEigVectors[0].length)
console.log(lapMatrix.length, lapMatrix[0].length)

const proectionMatrix = multiplyMatrix(matrix, lapEigVectors[1].sort((a, b) => b - a));
console.log("PROECTION");
console.log(matrix);
console.log(lapEigVectors[1].sort((a, b) => b - a));
console.log(proectionMatrix);

const xValues = [];
const yValues = [];
proectionMatrix.forEach((string) => {
    xValues.push(string[0]);
    yValues.push(string[1]);
});

// Создание конфигов для графиков на основе обработанных данных
const adjConfig = compressDataToHeatmap(matrix, chartDataConfig);
const lapConfig = compressDataToHeatmap(lapMatrix, chartDataConfig);
const valConfig = compressDataToMsline(undefined, [lapEigValues], ["eigen values"], chartDataConfig);
const proectionOn2Config = compressDataToMsline(undefined, [yValues], ["proection on 2nd vector"], chartDataConfig);
const proectionConfig = compressDataToBubble(lapEigVectors[1], [yValues], chartDataConfig, [], ["#ea3de4"]);

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
const buttons = [adjButton, lapButton, valButton, proectionOn2Button, proectionButton];

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

// graphButton.addEventListener("click", () => {
//     location.href = './graph/'
// });
