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

export function compressDataToHeatmap(manyYData, chartDataConfig, names = [], colors = []) {
    const yLinesCount = manyYData.length;
    const xLabels = [];
    const data1 = [];

    const data = {
        color: undefined,
        seriesName: undefined,
        data: [],
        anchorRadius: undefined,
        lineThickness: undefined,
        drawAnchors: undefined,
        anchorBgColor: undefined,
        anchorBorderColor: undefined,
        rowId: undefined,
        columnId: undefined,
        value: undefined,
    };
    //if (yLinesCount < 3) {
        data.color = undefined;
        data.seriesName = "";
        data.anchorRadius = 3;
        data.lineThickness = 0;
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
    const rows = [];
    const cols = [];
    manyYData[0].forEach((item, idx) => {
        cols.push({id: idx.toString()});
    });

    let min = manyYData[0][0];
    let max = manyYData[0][0];
    manyYData.forEach((yData, id) => {
        rows.push({id: id.toString()});
        yData.forEach((item, idx) => {
            if (item < min)
                min = item;
            if (item > max)
                max = item
            dataset.push({
                value: item,
                rowId: id.toString(),
                columnId: idx.toString(),
            });
        });
    });

    return {
        chart: chartDataConfig,
        rows: {
            row: rows
        },
        columns: {
            column: cols
        },
        dataset: [
            {
                data: dataset,
            }
        ],
        colorRange: {
            gradient: 1,
            code: "#2eeeee",
            startLabel: "Min",
            endLabel: "Max",
            color: [
                {
                    code: "#0b1742",
                    maxvalue: (min + max) / 2,
                },
                {
                    code: "#c529e8",
                    maxvalue: max,
                },
            ]
        }
    };
}

export function compressDataToBubble(xData, manyYData, chartDataConfig, names = [], colors = []) {
    const yLinesCount = manyYData.length;
    const xLabels = [];
    const data1 = [];
    xData.forEach((item, idx) => {
        xLabels.push({
            label: item.toString(),
            x: item,
        });
    });

    const data = {
        color: undefined,
        seriesName: undefined,
        data: [],
        anchorRadius: undefined,
        lineThickness: undefined,
        drawAnchors: undefined,
        anchorBgColor: undefined,
        anchorBorderColor: undefined,
    };
    //if (yLinesCount < 3) {
    data.color = undefined;
    data.seriesName = "";
    data.anchorRadius = 3;
    data.lineThickness = 0;
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
        yData.forEach((item, idx) => {
            curData.push({
                value: item,
                x: xData[idx],
                y: item,
                z: 1,
                showValue: 1,
            });
        });
        data.data = curData;
        if (names[id] !== undefined)
            data.seriesname = names[id];
        if (colors[id] !== undefined)
            data.color = colors[id];
        data.plotFillAlpha = 2;
        data.anchorBgColor = colors[id];
        data.valueBgColor = colors[id]
        dataset.push(Object.assign({}, data));
    });

    console.log({
        chart: chartDataConfig,
        categories: [
            {
                category: xLabels
            },
        ],
        dataset: dataset
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

export function compressDataToDragNode(xData, manyYData, chartDataConfig, names = [], colors = []) {
    const yLinesCount = manyYData.length;
    const xLabels = [];
    const data1 = [];
    xData.forEach((item, idx) => {
        xLabels.push({
            label: item.toString(),
            x: item,
        });
    });

    const data = {
        color: undefined,
        seriesName: undefined,
        data: [],
        anchorRadius: undefined,
        lineThickness: undefined,
        drawAnchors: undefined,
        anchorBgColor: undefined,
        anchorBorderColor: undefined,
    };
    //if (yLinesCount < 3) {
    data.color = undefined;
    data.seriesName = "";
    data.anchorRadius = 3;
    data.lineThickness = 0;
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
    const connections = [];
    manyYData.forEach((yData, id) => {
        const curData = [];
        yData.forEach((item, idx) => {
            curData.push({
                value: item,
                x: xData[idx],
                y: item,
                z: 1,
                showValue: 1,
            });
        });
        data.data = curData;
        if (names[id] !== undefined)
            data.seriesname = names[id];
        if (colors[id] !== undefined)
            data.color = colors[id];
        data.plotFillAlpha = 2;
        data.anchorBgColor = colors[id];
        data.valueBgColor = colors[id]
        dataset.push(Object.assign({}, data));
    });

    console.log({
        chart: chartDataConfig,
        dataset: [
            {
                id: 1,
                seriesName: "DS1",
                data: data,
            }
        ],
        connectors: [
            {
                stdThickness: 2,
                connector: connections,
            }
        ]
    });
    return {
        chart: chartDataConfig,
        dataset: [
            {
                id: 1,
                seriesName: "DS1",
                data: data,
            }
        ],
        connectors: [
            {
                stdThickness: 2,
                connector: connections,
            }
        ]
    };
}
