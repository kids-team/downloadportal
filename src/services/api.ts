
// @ts-nocheck
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function getUrl(path: string, params = {}, relative = false) {
	if(path[0] != '/') path = '/' + path;
	path = path.replaceAll(':', '/')
	if(Object.keys(params).length === 0) return relative ? path : SERVER_URL + path;

	let args = Object.entries(params).map(([key, value]) => {
		return key + '=' + encodeURI(value)
	}).join('&')
	return SERVER_URL + path + '?' + args
}

function getMediaUrl(id: string, size: number) {
	return SERVER_URL + '/_media' + id + '?w=' + size;
}

function getLink(id: string) {
	if(id == undefined) return '';
	console.log(id)
	let path = id.replaceAll(':', '/')
	if(path[0] != '/') path = '/' + path;
	return path;
}

export { getUrl, getMediaUrl, getLink };
