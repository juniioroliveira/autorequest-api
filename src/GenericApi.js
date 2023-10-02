
const axios = require('axios');
const Doc = require('./Documentation');
const Users = require('./Users');

// Configuração do cache de autenticação
let authCache = {};

/**
 * Faz uma chamada genérica à API usando o Axios.
 * @param {string} method - O método HTTP (GET, POST, PUT, etc.).
 * @param {string} url - A URL da API.
 * @param {object} data - Os dados a serem enviados para a API (opcional).
 * @param {object} headers - Os cabeçalhos a serem enviados para a API (opcional).
 * @param {string} token - O token de autenticação (opcional).
 * @returns {Promise<object>} - Uma promessa que resolve com a resposta da API ou um objeto de erro.
 */
async function genericAxios(apiName, method, url, data, headers = {}, token) {


    try {
        const options = {
            method,
            url,
            data,
            headers: {
                ...headers,
                Authorization: (token ? `Bearer ${token}` : null),
            },
        };

        const response = await axios(options);

        // Trata redirecionamento HTTP (status 3xx)
        if (response.status >= 300 && response.status < 400 && response.headers.location) {
            const newUrl = response.headers.location;
            return await genericAxios(method, newUrl, data, headers, token);
        }

        return response.data;
    } catch (error) {
        const errorData = {
            status: error?.response?.status || -1,
            message: error?.message || 'Erro desconhecido',
            code: error?.response?.data?.code || '',
            stack: error?.response?.status != 404 ?? error?.stack,
        };

        // Trata erro de autenticação (status 401)
        if (errorData.status === 401 && token) {
            delete authCache[apiName];
        }

        // Trata excesso de requisição
        if(errorData.status === 429){
            console.log('TRATANDO ERRO DE REQUISIÇÃO EXCESSIVA')

            // setInterval(genericAxios(apiName, method, url, data, headers, token), 2000)
        }

        if(errorData.status === 403){
            // console.log(apiName, method, url, data, headers)

            // setInterval(genericAxios(apiName, method, url, data, headers, token), 2000)
        }

        return errorData;
    }
}

/**
 * Faz uma chamada genérica à API usando a configuração especificada.
 * @param {string} apiName - O nome da API a ser usada.
 * @param {number} apiRoute - O índice do endpoint a ser usado (1 para o primeiro, 2 para o segundo, etc.).
 * @param {boolean} generateToken - Se deve gerar um token de autenticação ou não.
 * @param {string} token - O token de autenticação (opcional).
 * @param {object} credential - As credenciais de autenticação (opcional).
 * @param {object} headers - Os cabeçalhos a serem enviados para a API (opcional).
 * @param {object} params - Os parâmetros de consulta da URL (opcional).
 * @returns {Promise<object>} - Uma promessa que resolve com a resposta da API ou um objeto de erro.
 */
async function GenericApi(apiName, apiRoute, data, headers, params, query) {
    
    // Validação de entrada
    if (typeof apiName !== 'string') {
        return Promise.reject(new Error('O nome da API deve ser uma string.'));
    }

    if (typeof apiRoute !== 'number' || apiRoute < 1) {
        return Promise.reject(new Error('O índice do endpoint deve ser um número inteiro positivo.'));
    }

    try { 
        // Busca informações da API
        const apiInfo = await Doc.Get(apiName); // getAPIInfo(apiName);
        const route = apiInfo.endpoints[apiRoute - 1];
        let token;

        // Configuração do token de autenticação
        if (route.auth) {
            
            const { credential, tokenField } = Users.Get(apiName);
            
            if (!authCache[apiName]) {
                console.log(`Gerando token de acesso para ${route.url}`.cyan)
                const tokenResponse = await genericAxios(apiName, 'POST', apiInfo.tokenUrl, credential);
                
                authCache[apiName] = tokenResponse[tokenField];
            }
            token = authCache[apiName];
        }

        // Monta a URL com os parâmetros de consulta
        let url = `${apiInfo.baseUrl}${route.url}`;
        
        if (params) {
            // const queryParams = new URLSearchParams(params);
            url += `${params}`;

        }
        if(query){
            url += query;
        }

        // Faz a chamada à API
        let response = await genericAxios(apiName, route.method, url, data, headers, token);

        if(response?.status === 401){
            
            if (route.auth) {
                const { credential, tokenField } = Users.Get(apiName);
                const tokenResponse = await genericAxios(apiName, 'POST', apiInfo.tokenUrl, credential);
                    
                authCache[apiName] = tokenResponse[tokenField];
                
                token = authCache[apiName];
            }
            // Faz a chamada à API
            response = await genericAxios(apiName, route.method, url, data, headers, token);
        }

        
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**

Faz uma pausa de um determinado número de milissegundos.
@param {number} ms - O número de milissegundos a esperar.
@returns {Promise<void>}
*/
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    GenericApi,
    sleep,
};  