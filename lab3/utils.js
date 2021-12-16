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

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomArray(amount, min, max) {
    const array = [];
    for (let i = 0; i < amount; i++) {
        array.push(getRandom(min, max));
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
export function compressDataToMsline(xData, manyYData, names, chartDataConfig) {
    const yLinesCount = manyYData.length;
    const xLabels = [];
    const data1 = [];
    xData.forEach((item) => {
        xLabels.push({
            label: item,
        });
    });

    const data = {
        color: undefined,
        seriesname: undefined,
        data: [],
        anchorRadius: undefined,
        lineThickness: undefined,
        drawAnchors: undefined
    };
    //if (yLinesCount < 3) {
        data.color = undefined;
        data.seriesname = "";
        data.anchorRadius = 3;
        data.lineThickness = 2;
        data.drawAnchors = true;
        data.anchorAlpha = 50;
    /*} else if (yLinesCount === 3) {
        data.color = "#36b5d8";
        data.seriesname = "";
        data.lineThickness = 2;
        data.drawAnchors = false;
    } else {
        data.color = undefined;
        data.seriesname = "";
        data.lineThickness = 1;
        data.drawAnchors = false;
    }*/

    const dataset = [];
    manyYData.forEach((yData, id) => {
        const curData = [];
        if (yData.length === 2) {
            curData[yData[0] / 0.5] = {
                value: yData[1],
            };
            data.anchorAlpha = 100;
            data.lineThickness = 0;
            data.anchorRadius = 2;
        } else {
            yData.forEach((item) => {
                curData.push({
                    value: item,
                });
            });
        }
        if ((yLinesCount === 3) && (id === 2)) {
            data.lineThickness = 1;
            data.anchorAlpha = 30;
        }
        data.data = curData;
        if (names[id] !== undefined)
            data.seriesname = names[id];
        dataset.push(Object.assign({}, data));
    });

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
