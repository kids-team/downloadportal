const parseUrlQueryParams = url => {
    const urlParts = url.split('?');
    if (urlParts.length < 2) return {};
    const queryParameters = urlParts[1].split('&');
    const queryParametersObject = {};
    queryParameters.forEach(queryParameter => {
        const queryParameterParts = queryParameter.split('=');
        queryParametersObject[queryParameterParts[0]] = queryParameterParts[1];
    });
    return queryParametersObject;
};

export default parseUrlQueryParams;
