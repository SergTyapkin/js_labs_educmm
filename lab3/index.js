import {compressDataToMsline, getArray, getRandom, getRandomArray} from "./utils.js";
import {I, h, t_n, getFunctions, getAdditionalCondition, euler, implicit_euler, runge_kutta} from "./funcs.js";

const modes = [[0.02, 0.2, -65, 6], [0.02, 0.25, -65, 6], [0.02, 0.2, -50, 2], [0.1, 0.2, -65, 2]];


const n = Math.round(t_n / h)  // Количество узлов
const tValues = getArray(0, n * h, h); // Генерация дискретных значений по оси времени
const strTValues = tValues.map((item) => {
    const strNum = Math.ceil(item * 10).toString();
    return strNum.substr(0, strNum.length - 1) + '.' + strNum[strNum.length - 1];
});


let answers_euler;
let answers_imp_euler;
let answers_runge = []

// Create a JSON object to store the chart configurations
const chartDataConfig = {
    caption: "Потенциал мембраны нейрона от времени",
    subCaption: "для различных параметров динамической системы",
    xAxisName: "X",
    yAxisName: "Y",
    numberSuffix: "",
    theme: "candy",
    lineThickness: "2",
    captionFont: "sans-serif",
    subCaptionFont: "sans-serif",
    labelFontColor: "#999ca5",
    yAxisNameFontColor: "#999ca5",
}

let chart;
let current_list = modes[1].concat();

FusionCharts.ready(() => {
    chart = new FusionCharts({
        type: "msline",
        renderAt: "chart-1",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource: undefined,
    });
    chart.render();

    updateChart(modes[1]);
});

function updateChart(list) {
    const v_0 = list[2]
    const u_0 = v_0 * list[1]

    answers_euler = euler([v_0, u_0], t_n, getFunctions(list), getAdditionalCondition(list))
    //answers_imp_euler = implicit_euler([v_0, u_0], t_n, getFunctions(mode), getDFunctions(mode), getAdditionalCondition(mode))
    answers_runge = runge_kutta([v_0, u_0], t_n, getFunctions(list), getAdditionalCondition(list))

    chart.setJSONData(compressDataToMsline(strTValues, [answers_euler[0], answers_runge[0]], ["euler", "runge"], chartDataConfig));
}

const inputElems = Array.from(document.getElementsByClassName("footer-input"));
const valueElems = Array.from(document.getElementsByClassName("footer-value"));
inputElems.forEach((input) => {
    input.addEventListener("input", () => {
        current_list = inputElems.map((elem, id) => {
            valueElems[id].innerText = elem.value;
            return +elem.value;
        });
        updateChart(current_list);
        console.log(current_list);
    });
});


const buttonDiscotheque = document.getElementById('button-discotheque');
// Discotheque button
let isDiscotheque = false;
let interval;
let intervals = [
    [0, 0.2],
    [0, 0.5],
    [-200, 0],
    [0, 10]
];

buttonDiscotheque.addEventListener('click', () => {
    buttonDiscotheque.classList.toggle('clicked');
    if (isDiscotheque) {
        clearInterval(interval);
        isDiscotheque = false;
        return;
    }
    interval = setInterval(() => {
        current_list = inputElems.map((elem, id) => {
            elem.value = getRandom(...intervals[id])
            valueElems[id].innerText = elem.value;
            return +elem.value;
        });
        console.log(current_list);
        updateChart(current_list);
    }, 1000);
    isDiscotheque = true;
});
