import {compressDataToMsline, getRandom} from "../utils.js";
import {I, h, getFunctions, getAdditionalCondition, euler} from "../funcs.js";

const t_n = 300;

const n_starts = 80
const n_stops = 20


const coeffs = []
for (let i = 0; i < n_starts; i++) {
    const a = getRandom(0, 1);
    const b = getRandom(0, 1);
    const e = getRandom(0, 1);
    coeffs.push([
        0.02, // a
        0.2, // b
        -65 + 15 * a * a, // c
        8 - 6 * b * b, // d
        5 * e, // I
        -65, // V0
        -65 * b, // U0
    ]);
}
for (let i = 0; i < n_stops; i++) {
    const y = getRandom(0, 1);
    const b = getRandom(0, 1);
    const c = getRandom(0, 1);
    coeffs.push([
        0.02 + 0.08 * y, // a
        0.25 - 0.05 * b, // b
        -65, // c
        2, // d
        2 * c, // I
        -65, // V0
        -65 * b, // U0
    ]);
}


const answers = [];
let I_total = 0;
let tValues = [];
for (let t = 0; t < t_n; t += h) {
    const last_I = I_total;
    I_total = 0;
    coeffs.forEach((coeff, id) => {
        const callback = (answer) => {
            if (answer[0] >= 30) {
                if (id < n_starts) {
                    I_total += coeffs[id][4] * getRandom(0, 1);
                } else {
                    I_total += -getRandom(0, 1);
                }
                answers.push([t, id]);
            }
            return getAdditionalCondition(coeff)(answer);
        }

        const answer = euler([ coeff[5], coeff[6]], h, getFunctions(coeff, I + last_I), callback);
        coeffs[id][5] = answer[0][1];
        coeffs[id][6] = answer[1][1];
    });
    tValues.push(t);
}
console.log(answers);



const strTValues = tValues.map((item) => {
    const strNum = Math.ceil(item * 10).toString();
    return strNum.substr(0, strNum.length - 1) + '.' + strNum[strNum.length - 1];
});

// Create a JSON object to store the chart configurations
const chartDataConfig = {
    caption: "Моделирование нейронной сети",
    subCaption: "для 100 нейронов моделей Ижикевича",
    xAxisName: "T",
    yAxisName: "Номер нейрона",
    numberSuffix: "",
    theme: "candy",
    lineThickness: "2",
    captionFont: "sans-serif",
    subCaptionFont: "sans-serif",
    labelFontColor: "#999ca5",
    yAxisNameFontColor: "#999ca5",
}

FusionCharts.ready(() => {
    const chart = new FusionCharts({
        type: "msline",
        renderAt: "chart-1",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource: compressDataToMsline(strTValues, answers, [], chartDataConfig),
    });
    chart.render();
});
