'use strict';

export function fsolve(fx, dfx, x0, args, eps = 1e-6, maxIterations = 1000) {
    function foo(x) {
        return fx(x, ...args);
    }
    function dfoo(x) {
        return dfx(x, ...args);
    }

    let x1 = x0 - foo(x0)/dfoo(x0); // первое приближени
    console.log(x1);
    let i = 0;
    while (Math.abs(x1-x0) > eps && i < maxIterations) { // пока не достигнута точность eps
        console.log(i, x1, foo(x1));
        x0 = x1;
        x1 = x0 - foo(x0)/dfoo(x0); // последующие приближения
        i++;
    }
    return x1;
}

//console.log("TEST fsolve:", fsolve((x) => Math.cos(x), (x) => -Math.sin(x), 1, []));
