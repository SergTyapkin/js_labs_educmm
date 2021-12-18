'use strict';

const cors_api_url = 'https://cors-anywhere.herokuapp.com/';
export async function CORSRequest(url, method, data) {
    const headers = {};
    if (method === "POST")
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return await fetch(cors_api_url + url, {
        method: 'POST',
        headers: headers,
        body: data
    });
}

