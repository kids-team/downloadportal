const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');

app.get('/', function (request, response) {
    console.log('Home page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace(/\$OG_TITLE/g, 'Home Page');
        data = data.replace(/\$OG_DESCRIPTION/g, 'Home page description');
        result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    });
});

const page = async function (id) {
    var fromServer = await fetch('https://dlapi.kids-team.com/?controller=page&id=' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            return responseJson.myString;
        });
};

app.get('/*', function (request, response) {
    const data = page(request.params[0]);

    const filePath = path.resolve(__dirname, './build', 'index.html');

    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace(/\$OG_TITLE/g, 'About Page');
        data = data.replace(/\$OG_DESCRIPTION/g, 'About page description');
        result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    });
});

app.get('/contact', function (request, response) {
    console.log('Contact page visited!');
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace(/\$OG_TITLE/g, 'Contact Page');
        data = data.replace(/\$OG_DESCRIPTION/g, 'Contact page description');
        result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    });
});

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', function (request, response) {
    const filePath = path.resolve(__dirname, './build', 'index.html');
    response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
