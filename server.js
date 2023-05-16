/*
 *	Vendor imports
 */
import express from 'express';
import fs from 'fs';
import https from 'https';
import fetch from 'node-fetch';
import { parseDomain } from 'parse-domain';
import path from 'path';
import { fileURLToPath } from 'url';

import parseUrlQueryParams from './server/parseUrlQueryParams.js';

/*
 * App constants
 */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;
const httpsPort = process.env.HTTPS_PORT || 4000;
const filePath = path.resolve(__dirname, './build', 'index.html');

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

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', async function (request, response) {
    const urlParams = parseUrlQueryParams(request.url);
    const htmlData = fs.readFileSync(filePath, 'utf8');

	const { topLevelDomains } = parseDomain(request.hostname);

	const lang = urlParams.lang || topLevelDomains[0];

	console.log('lang', topLevelDomains[0]);

    let page = await fetch(
        `https://dlapi.kids-team.com/?controller=page&method=meta&id=${request._parsedUrl.pathname}&lang=${lang}`
    );
    const pageData = await page.json();

    let injectedHtml = htmlData
        .replace(/__LANG__/g, urlParams.lang)
        .replace(/__PAGE_DATA__/g, JSON.stringify(pageData))
        .replaceAll(/__DESCRIPTION__/g, pageData.abstract)
        .replace(/__TITLE__/g, pageData.title)
        .replace(/__URL__/g, request.url)
        .replace(/__IMAGE__/g, `https://dlapi.kids-team.com/_media/${pageData.pageimage}?w=720&lang=${urlParams.lang}`);

    response.send(injectedHtml);
});

app.listen(port, () => console.log(`✅ HTTP Server running on port ${port}`));
