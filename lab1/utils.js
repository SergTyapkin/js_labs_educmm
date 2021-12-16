'use strict';

function gaussianRand() {
    let rand = 0;
    for (let i = 0; i < 6; i++) {
        rand += Math.random();
    }
    return rand / 6;
}
export function gaussianRandom(start, end) {
    return start + gaussianRand() * (end - start);
}

export function addRandomError(nodes, delta) {
    const res = [];
    nodes.forEach((x) => { res.push(gaussianRandom(x - delta, x + delta)); });
    return res;
}
export function getArray(min, max, step) {
    const array = [];
    for (let i = min; i < max; i += step) {
        array.push(i);
    }
    return array;
}
export function getRandomArray(amount, min, max) {
    const array = [];
    for (let i = 0; i < amount; i++) {
        array.push(Math.random() * (max - min) + min);
    }
    return array;
}

export function compressDataToLine(xData, yData, chartDataConfig) {
    const data = [];
    xData.forEach((item, idx) => {
        data.push({
            label: item,
            value: yData[idx]
        });
    });
    return {
        chart: chartDataConfig,
        data: data
    };
}
export function compressDataToMsline(xData, manyYData, name1, yData2, name2, chartDataConfig) {
    const yLinesCount = manyYData.length;
    const xLabels = [];
    const data1 = [];
    const data2 = [];
    xData.forEach((item) => {
        xLabels.push({
            label: item,
        });
    });

    let curDy;
    let curYLen = 0;
    for (let i = 0; i < manyYData[0].length; i++) {
        let alpha = 0;
        const idx = Math.floor(i / 10);
        curYLen += curDy;
        if (i % 10 === 0) {
            alpha = 100;
            curYLen = 0;
            if (yData2[idx + 1]) {
                curDy = (yData2[idx + 1] - yData2[idx]) / 10;
            } else {
                curDy = (yData2[idx] - yData2[idx - 1]) / 10;
            }
        }
        const value = yData2[idx] + curYLen;
        data2.push({
            value: value,
            anchorAlpha: alpha
        });
    }

    const data = {
        color: undefined,
        seriesname: undefined,
        data: [],
        anchorRadius: undefined,
        lineThickness: undefined,
        drawAnchors: undefined
    };
    if (yLinesCount < 3) {
        data.color = "#36b5d8";
        data.seriesname = name1;
        data.anchorRadius = 3;
        data.lineThickness = 3;
        data.drawAnchors = true;
    } else if (yLinesCount === 3) {
        data.color = "#36b5d8";
        data.seriesname = "";
        data.lineThickness = 2;
        data.drawAnchors = false;
    } else {
        data.color = undefined;
        data.seriesname = "";
        data.lineThickness = 1;
        data.drawAnchors = false;
    }

    const dataset = [];
    manyYData.forEach((yData) => {
        const curData = [];
        yData.forEach((item) => {
            curData.push({
                value: item,
            });
        });
        data.data = curData;
        dataset.push(Object.assign({}, data));
    });

    dataset.push({
        color: "#f0dc46",
        seriesname: name2,
        data: data2,
        lineThickness: 1
    });

    if (yLinesCount === 3) {
        dataset[2].color = "#d87436";
        dataset[2].lineThickness = 2;
        dataset[2].seriesname = "avg";
    }

    return {
        chart: chartDataConfig,
        categories: [
            {
                category: xLabels
            },
        ],
        dataset: dataset
    };
}
