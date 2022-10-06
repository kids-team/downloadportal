/*
*	gets the Top level domain and cares about a possible port number
*
*/
function getTopLevelDomain(): string {
	let tld: string = window.location.origin.split('.').pop() ?? 'de';
	if(tld.includes(':')) {
		tld = tld.split(':')[0];
	}
	return tld;
}

export default getTopLevelDomain;