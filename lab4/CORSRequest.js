'use strict';

const cors_api_url = 'https://cors-anywhere.herokuapp.com/';
export async function CORSRequest(url, method, data) {
    const headers = {};
    if (method === "POST")
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

    function redirect() {
        alert("Для использования CORS-proxy-API нужно будет кликнуть на кнопку на их сайте. Готов?");
        location.href = cors_api_url;
    }
    let response;
    try {
        response = await fetch(cors_api_url + url, {
            method: 'POST',
            headers: headers,
            body: data
        });
    } catch {
        redirect();
    }

    if (response?.status === 503) {
        redirect();
    }
    return response;
}

