var express = require('express');
const env = require('./.env');
const fetch = require('node-fetch');

var app = express();

var port = 5000;

app.use(express.static('public'));

var apiToken = null;

function setAPIToken() {
    var body = {
        email: env.apicredentials.email, 
        password: env.apicredentials.password
    }
    fetch(env.apiBase + '/users/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(json => apiToken = json.token)
        .catch (err => console.log(err))
}

setAPIToken();

app.get('/', function(req, res){
    res.send('public/');
});

app.get('/authenticate', async function (req, res) {
    res.json(apiToken);
})

app.get('/trips', async function (req, res) {
    fetch(env.apiBase + '/trips', {
        method: 'GET',
        headers: {
            'x-access-token': apiToken
        }
    }).then(res => res.json())
    .catch (err => console.log(err))
});

app.listen(5000, function(err){
    console.log('Servidor funcionando na porta -> ' + port);
});
