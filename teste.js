const Documentation = require("./src/Documentation");
const Users = require("./src/Users");

let users =[ 
    {   
        plataform: 'Ifood',
        credential: {
            client_Id: '662f0a39-f96e-4823-b65c-5d3a4986d010',
            client_Secret: 'pbh7Q~ZLTVFCkiyIb7S.q069DyMRyYjEpkQhM'
        },
        tokenField: 'access_token' 
    },
    {  
        plataform: 'Drogaleste',
        credential: { 
            clientId: 'aW50ZWdyYXRpb25AZGVsaXZlcnlwbHVzLmNvbS5icg==',
            clientSecret: 'NDUxMjMwMjc4NjZEZWxpdmVyeSBQbHVz'
        },
        tokenField: 'accessToken'
    }
];   

Users.Set(users)

console.log(Users.Get());



const docs = [
    {
        name: 'Drogaleste',
        description: 'API do iFood para integração de serviços.',
        baseUrl: 'http://apidrogaleste.ddns.net:7150/api',
        tokenUrl: 'http://apidrogaleste.ddns.net:7150/api/oauth',
        endpoints: [
        {
            code: 1,
            method: 'GET',
            name: 'Consultar status',
            url: '/status',
            description: 'Obtém informações sobre um pedido específico.',
            auth: false,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {}
        },
        {
            code: 2,
            method: 'GET',
            name: 'Consultar lojas',
            url: '/drogaleste/store',
            description: 'Obtém informações sobre um pedido específico.',
            auth: true,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {
            matriz: 10
            }
        },
        {
            code: 3,
            method: 'GET',
            name: 'Eventos de pedidos do Aplicativo',
            url: '/drogaleste/orders/app/',
            description: 'Obtém informações sobre um pedido específico.',
            auth: true,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {
            matriz: 10
            }
        },
        {
            code: 4,
            method: 'GET',
            name: 'Eventos de pedidos do Aplicativo',
            url: '/drogaleste/orders/app/events',
            description: 'Obtém informações sobre um pedido específico.',
            auth: true,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {
            matriz: 10
            }
        },
        {
            code: 5,
            method: 'POST',
            name: 'Comandos SQL',
            url: '/drogaleste/tools/execute-sql',
            description: 'Executa consultas no banco com linguagem SQL',
            auth: true,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {}
        }
        ],
    },
    {
        name: 'Ifood',
        description: 'API do iFood para integração de serviços.',
        baseUrl: 'https://service.sitemercado.com.br/api/v1',
        tokenUrl: 'https://service.sitemercado.com.br/api/v1/oauth/token',
        endpoints: [
          {
            code: 1,
            method: 'GET',
            name: 'Consultar pedido',
            url: '/pedido/',
            description: 'Obtém informações sobre um pedido específico.',
            auth: true,
            generateToken: false,
            loop: false,
            interval: 1000,
            headers: {}
          },
          {
            code: 2,
            method: 'GET',
            name: 'Consultar eventos de pedido',
            url: '/pedido/eventos/',
            description: 'Obtém uma lista de eventos de um pedido específico.',
            auth: true,
            generateToken: false,
            loop: true,
            interval: 1000,
            headers: {}
          },
        ],
      }
];

Documentation.Set(docs)