const should = require('should');
const http = require('axios');
const getCookie = require('./getToken');
let cookie;
const mainURL = process.env.TEST_URL || 'https://localhost:3000';
const LOG_REQUEST_ERROR_DETAILS = false;

// let browser_cookie= ''
async function generateAPIRequest(method, subURL, params) {

    await getCookie.getOauth2Token().then(function (token) {
        cookie = token;
    });

 // cookie = 'eyJ0eXAiOiJKV1QiLCJ6aXAiOiJOT05FIiwia2lkIjoiRm8rQXAybThDT3ROb290ZjF4TWg0bGc3MFlBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJzc2NzNGp1aUBtYWlsbmVzaWEuY29tIiwiYXV0aF9sZXZlbCI6MCwiYXVkaXRUcmFja2luZ0lkIjoiYjczMTc1MDQtN2YwYy00MDU4LWEyMDQtM2YwNTZhMTFlYmI0IiwiaXNzIjoiaHR0cHM6Ly9mb3JnZXJvY2stYW0uc2VydmljZS5jb3JlLWNvbXB1dGUtaWRhbS1hYXQuaW50ZXJuYWw6ODQ0My9vcGVuYW0vb2F1dGgyL2htY3RzIiwidG9rZW5OYW1lIjoiYWNjZXNzX3Rva2VuIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImF1dGhHcmFudElkIjoiNjMzMmY1MTgtMTg5Ny00NzZkLWFkMjMtMzkwMGU3OTA4NTgyIiwiYXVkIjoieHVpd2ViYXBwIiwibmJmIjoxNTYzMjAzNTQ5LCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwic2NvcGUiOlsiYWNyIiwib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiYXV0aG9yaXRpZXMiXSwiYXV0aF90aW1lIjoxNTYzMjAzNTQ5MDAwLCJyZWFsbSI6Ii9obWN0cyIsImV4cCI6MTU2MzIzMjM0OSwiaWF0IjoxNTYzMjAzNTQ5LCJleHBpcmVzX2luIjoyODgwMCwianRpIjoiMDY1MDhiZTAtYjhkZC00OTk0LTliZjctMzk4OWI2MmQ3OTRlIn0.ZB20SpSA3gMIPdvU_ryuHSwkzOaa_IbyksXa0iZO8kQbl5CrZSS55GLvFjTUd2g7Uo0HeT__-IkiBY3tsCh6SRUjJ8-Bh2k1drUCibrW8NpTibyk8FYoYsRsf4BSkaNnQJaRdxH_6dnCUu68jeuwp5wBmURb5P6FX3vq0WLZZcuJ7woCNOJwFE3OvGNrPNrMmfY6ksbyhK5SyR9ZB5phCt10mkPKJsOXaE6qnR_dBnqr483SaRdYkXyfjd4knaqheGfK1B_l1MRjODGf-dfMm9KzsQ_aI3dY7sbe8O6xg4VJApNkUgDlsef70h-3euHqbil_kvHC4yeH3rOnsFumMQ'

    const options = {
        headers: {
            Cookie: '__auth__=' + cookie,
            'Content-Type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };

    if (params.body) options.body = params.body;

    let response
console.log(mainURL + subURL)
    try {
        response = await http(method, mainURL + subURL, options)
    } catch (e) {
        if (LOG_REQUEST_ERROR_DETAILS) {
            console.log(error.response.body, 'ERROR !');
        }
    }
    if (LOG_REQUEST_ERROR_DETAILS) {
        requestPromise.catch(error => console.log(error.response.body, 'ERROR !'));
    }
    return response;
}

module.exports.generateAPIRequest = generateAPIRequest;
