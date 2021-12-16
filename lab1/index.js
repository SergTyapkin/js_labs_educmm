'use strict';

import {qubicSplineCoeff, qibicSpline} from "./cubic_spline.js";
import {L, l_i} from "./lagrange.js";
import {getArray, getRandomArray, compressDataToLine, compressDataToMsline, addRandomError} from "./utils.js";

const xMin = 0;
const xMax = 1.01;
const yMin = -1;
const yMax = 1;
const dx = 0.1;

// get 10 x values  0...1
const firstXValues = getArray(xMin, xMax, dx);
let xValues = firstXValues;
// set 10 y values
let yValues = [3.37, 3.95, 3.73, 3.59, 3.15, 3.15, 3.05, 3.86, 3.60, 3.70, 3.02];

// get 100 spline x values 0...1
const dxValues = getArray(xMin, xMax, dx / 10);
// round values because JS can't normally compute float
const strXValues = dxValues.map((item) => {
    const strNum = Math.ceil(item * 100).toString();
    if (strNum.length > 2) {
        return strNum[0] + '.' + strNum.substr(1, strNum.length);
    }
    return '0.' + strNum;
});

let interpolationFunc = (x) => { return qibicSpline(x, xValues, qubicSplineCoeff(xValues, yValues)); }
let chart;

let isX1000 = false
let x1000mode = 'x';
let isAvg = false;

const delta = 0.03;
const linesCount = 100;
function updateChart() {
    let manyYSplines = [];
    if (isX1000) {
        if (x1000mode === 'x') {
            for (let i = 0; i < linesCount; i++) {
                xValues = addRandomError(firstXValues, delta);
                manyYSplines.push(dxValues.map(interpolationFunc));
            }
        } else {
            const savedYValues = yValues;
            for (let i = 0; i < linesCount; i++) {
                yValues = addRandomError(savedYValues, delta);
                manyYSplines.push(dxValues.map(interpolationFunc));
            }
            yValues = savedYValues;
        }

        if (isAvg) {
            const avgSplines = [[], [], []];
            for (let pointIdx = 0; pointIdx < manyYSplines[0].length; pointIdx++) {
                let curAvg = 0;
                const points = [];
                for (let splineIdx = 0; splineIdx < linesCount; splineIdx++) {
                    points.push(manyYSplines[splineIdx][pointIdx]);
                    curAvg += manyYSplines[splineIdx][pointIdx];
                }
                points.sort((a, b) => { return a - b; });
                avgSplines[0].push(points[linesCount * 0.05]); // lower of 90%
                avgSplines[1].push(points[linesCount * 0.95]); // higher of 90%
                curAvg /= linesCount;
                avgSplines[2].push(curAvg);
            }
            manyYSplines = avgSplines;
        }
    } else {
        xValues = firstXValues;
        ySpline = dxValues.map(interpolationFunc);
        manyYSplines.push(ySpline);
        // yValues.forEach((y, idx) => {
        //      manyYSplines.push(dxValues.map((x) => { return y * l_i(idx, x, xValues); }));
        // }); // Это чтобы посмотреть на базисные полиномы Лагранжа отдельно
    }
    chart.setJSONData(compressDataToMsline(strXValues, manyYSplines, 'Interpolated', yValues, 'Input', chartDataConfig));
}
let ySpline = dxValues.map(interpolationFunc);

// Create a JSON object to store the chart configurations
const chartDataConfig = {
    caption: "Интерполяция разными методами",
    subCaption: "по 11-ти точкам",
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

const buttonDiscotheque = document.getElementById('button-discotheque');
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');
const buttonX1000 = document.getElementById('button-x-1000');
const buttonX = document.getElementById('button-x');
const buttonY = document.getElementById('button-y');
const buttonAvg = document.getElementById('button-avg');
FusionCharts.ready(() => {
    chart = new FusionCharts({
        type: "msline",
        renderAt: "chart-1",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource: compressDataToMsline(strXValues, [ySpline], 'Interpolated', yValues, 'Input', chartDataConfig),
    });
    chart.render();

    // Left button
    buttonLeft.addEventListener('click', () => {
        buttonLeft.classList.add('active');
        buttonRight.classList.remove('active');
        interpolationFunc = (x) => { return qibicSpline(x, xValues, qubicSplineCoeff(xValues, yValues)); } // cubic spline
        updateChart();
    });
    // Right button
    buttonRight.addEventListener('click', () => {
        buttonRight.classList.add('active');
        buttonLeft.classList.remove('active');
        interpolationFunc = (x) => { return L(x, xValues, yValues); } // Lagrange
        updateChart();
    });
    // X-1000 button
    buttonX1000.addEventListener('click', () => {
        isX1000 = !isX1000;
        buttonX1000.classList.toggle('clicked');
        updateChart();
    });
    // x button
    buttonX.addEventListener('click', () => {
        x1000mode ='x';
        buttonX.classList.add('clicked');
        buttonY.classList.remove('clicked');
        updateChart();
    });
    // y button
    buttonY.addEventListener('click', () => {
        x1000mode = 'y'
        buttonY.classList.add('clicked');
        buttonX.classList.remove('clicked');
        updateChart();
    });
    // avg button
    buttonAvg.addEventListener('click', () => {
        isAvg = !isAvg;
        buttonAvg.classList.toggle('clicked');
        updateChart();
    });

    // Discotheque button
    let isDiscotheque = false;
    let interval;
    buttonDiscotheque.addEventListener('click', () => {
        buttonDiscotheque.classList.toggle('clicked');
        if (isDiscotheque) {
            clearInterval(interval);
            isDiscotheque = false;
            return;
        }
        interval = setInterval(() => {
            // get 10 random y values
            yValues = getRandomArray(xValues.length, yMin, yMax);
            updateChart();
        }, 1000);
        isDiscotheque = true;
    });
});
