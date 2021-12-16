'use strict';

export function l_i(idx, x, xNodes) {
    const n = xNodes.length;
    const xDel = xNodes[idx];

    let res = 1;
    for (let i = 0; i < n; i++) {
        if (i !== idx) {
            res *= (x - xNodes[i]);
            res /= (xDel - xNodes[i]);
        }
    }
    return res;
}

export function L(x, xNodes, yNodes) {
    let res = 0;
    yNodes.forEach((y, idx) => {
        res += y * l_i(idx, x, xNodes);
    });
    return res;
}
