const express = require('express');
const app = express();
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const httpsPort = process.env.HTTPS_PORT || 4000;
const https = require('https');
const path = require('path');
const fs = require('fs');
const redis = require('redis');
import fetch from 'node-fetch';
var session = require('express-session');

console.log('Welcome to express.js Server');

https
    .createServer(
        {
            key: fs.readFileSync('.ssl/server.key'),
            cert: fs.readFileSync('.ssl/server.cert'),
        },
        app
    )
    .listen(httpsPort, () => {
        console.log(`✅ HTTPS server is running on port ${httpsPort}`);
    });

//let RedisStore = require('connect-redis')(session);
//let redisClient = redis.createClient();

//redisClient.on('error', err => console.log(`❌ Fail to connect with redis. ${err}`));
//redisClient.on('connect', () => console.log('✅ Successful to connect with redis'));

app.use(
    sessions({
        saveUninitialized: true,
        secret: 'nvcuioseprfhkjclgsegfdjzsgcfchsdacf',
        resave: false,
        secure: true,
    })
);

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, './build')));

app.post('/api/lang', async function (request, response) {
    console.log('Lang set to ', request.body.lang);
    console.log('Session: ', session);
    session.lang = request.body.lang;
});

app.get('*', async function (request, response) {
    let language = session.lang;
    if (language === undefined) response.cookie('lang', 'de');

    const filePath = path.resolve(__dirname, './build', 'index.html');

    let page = await fetch(
        'https://dlapi.kids-team.com/?controller=page&method=meta&id=' + request.url + '&lang=' + session.lang
    );
    const pageData = await page.json();

    fs.readFile(filePath, 'utf8', function (error, data) {
        if (error) {
            response.send(
                "There has been a critical error. It's not you, it's us. Please contact the administrator. We're sorry for the inconvenience."
            );
        }

        let htmlData = data
            .replace(/__LANG__/g, session.lang)
            .replace(/__PAGE_DATA__/g, JSON.stringify(pageData))
            .replaceAll(/__DESCRIPTION__/g, pageData.abstract)
            .replace(/__TITLE__/g, pageData.title)
            .replace(/__URL__/g, request.url)
            .replace(
                /__IMAGE__/g,
                `https://dlapi.kids-team.com/_media/${pageData.pageimage}?w=720&lang=${session.lang}`
            );

        response.send(htmlData);
    });
});

app.listen(port, () => console.log(`✅ HTTP Server running on port ${port}`));
