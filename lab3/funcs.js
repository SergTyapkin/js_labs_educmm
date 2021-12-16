import {fsolve} from "./fsolver.js"


export const h = 0.5;
export const I = 5;
export const t_n = 100;

export function getFunctions(list, I_ = I) {
    return (arr) => [
        0.04 * arr[0] * arr[0] + 5 * arr[0] + 140 - arr[1] + I_,
        list[0] * (list[1] * arr[0] - arr[1]),
        // Можно дописать ещё любые функции для системы
    ];
}


export function getDFunctions(list) {
    return (arr) => [
        0.04 * 2 * arr[0] + 5,
        -list[0],
        // Можно дописать ещё любые производные функций для системы
    ];
}


export function getAdditionalCondition(list) {
    return (answer) => {
        if (answer[0] >= 30) {
            answer[0] = list[2];
            answer[1] += list[3];
        }
        return answer;
    }
}


export function euler(x_0, t_n, f, additionalCondition) {
    const n = Math.round(t_n / h);  // Количество узлов

    // функция будет работать для системы из любого числа уравнений, так что x_0 - это список,
    // а в answers будут лежать списки значений каждой функции, так что answers - матрица
    const answers = [];
    let cur_answers = [];
    x_0.forEach((ans) => {
        answers.push([ans]);
        cur_answers.push(ans);
    });

    for (let i = 0; i < n; i++) {
        cur_answers = f(cur_answers);  // считаем функцию. В нашем случае это f(u, v)
        cur_answers = cur_answers.map((ans, id) => answers[id][i] + h * ans);  // считаем новые значения для i+1 элемента
        cur_answers = additionalCondition(cur_answers)  // применяем особое условие. Ну, про "если v(t) >= 30, то ..."

        cur_answers.forEach((ans, id) => {  // добавляем итоговые решения на текущем шаге в список конечных ответов
            answers[id].push(ans)
        });
    }
    return answers
}

/*
export function implicit_euler(x_0, t_n, f, additionalCondition) {
    const n = Math.round(t_n / h)  // Количество узлов

    const answers = []
    x_0.forEach((ans) => {
        answers.push(ans);
    });

    function phi(x, cur_answers, ans_id) {
        let minus_sum = sum(cur_answers) - cur_answers[ans_id]
        return x - minus_sum - h * f(cur_answers)[ans_id]
    }

    for i in range(n) {
        last_answers = []
        for ans_id in range(answers_count) {  // получаем предыдущие значения
            last_answers.push(answers[ans_id][i])
        }
        print(i)
        cur_answers = []
        for ans_id in range(answers_count) {  // получаем новые значения
            res = optimize.fsolve(phi, answers[ans_id][i], args = (last_answers, ans_id))
            cur_answers.push(res)
        }
        cur_answers = additional_condition(cur_answers)  // применяем особое условие. Ну, про "если v(t) >= 30, то ..."

        for ans_id in range(answers_count) {  // добавляем итоговые решения на текущем шаге в список конечных ответов
            answers[ans_id].push(cur_answers[ans_id])
        }
    }
    return answers
}
*/


export function implicit_euler(x_0, t_n, f, df, additional_condition) {
    const n = Math.round(t_n / h);  // Количество узлов

    // В этой функции я не смог написать единую формулу для phi для системы из любого кол-ва уравнений.
    // Потому пришлось перейти к двум функциям.

    const v = [x_0[0]];
    const u = [x_0[1]];

    function phi_v(v, u_i, v_i) {
        return v - v_i - h * f([v_i, u_i])[0];
    }

    function phi_u(u, u_i, v_i) {
        return u - u_i - h * f([v_i, u_i])[1];
    }

    function dphi_v(v, u_i, v_i) {
        return (1 - v_i - h * f([v_i, u_i])[0]) * (df([v_i, u_i])[0]);
    }

    function dphi_u(u, u_i, v_i) {
        return (1 - u_i - h * f([v_i, u_i])[1]) * (df([v_i, u_i])[1]);
    }

    for (let i = 0; i < n; i++) {
        console.log(i, n);
        v.push(fsolve(phi_v, dphi_v, v[i], [u[i], v[i]]))
        u.push(fsolve(phi_u, dphi_u, u[i], [u[i], v[i]]))

        const ans = additional_condition([v[i + 1], u[i + 1]])
        v[i+1] = ans[0];
        u[i+1] = ans[1];
        debugger;
    }
    return [v, u]
}

export function runge_kutta(x_0, t_n, f, additional_condition) {
    const n = Math.round(t_n / h)  // Количество узлов

    const v = [x_0[0]]
    const u = [x_0[1]]

    // С рядами Тейлора играть в игры с N неизвестными в уравнениях точно не стоит.
    // Формула и так сложная, так что тоже стоит перейти к двум функциям

    for (let i = 0; i < n; i++) {
        let [k1_v, k1_u] = f([v[i], u[i]])
        k1_v *= h
        k1_u *= h

        let k2_v = h * f([v[i] + k1_v / 2, u[i] + h / 2])[0]
        let k2_u = h * f([v[i] + h / 2, u[i] + k1_u / 2])[1]

        let k3_v = h * f([v[i] + k2_v / 2, u[i] + h / 2])[0]
        let k3_u = h * f([v[i] + h / 2, u[i] + k2_u / 2])[1]

        let k4_v = h * f([v[i] + k3_v, u[i] + h])[0]
        let k4_u = h * f([v[i] + h, u[i] + k3_u])[1]

        v.push(v[i] + (k1_v + 2 * k2_v + 2 * k3_v + k4_v) / 6)
        u.push(u[i] + (k1_u + 2 * k2_u + 2 * k3_u + k4_u) / 6)

        const ans = additional_condition([v[i + 1], u[i + 1]])
        v[i+1] = ans[0];
        u[i+1] = ans[1];
    }
    return [v, u]
}
