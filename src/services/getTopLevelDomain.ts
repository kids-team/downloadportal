/*
 *	gets the Top level domain and cares about a possible port number
 *
 */
function getTopLevelDomain(fallback: string = 'de'): string {
    if (!window.location.origin.includes('.')) return fallback;
    let tld: string = window.location.origin.split('.').pop() ?? fallback;
    if (tld.includes(':')) {
        return tld.split(':')[0];
    }
    return tld;
}

export default getTopLevelDomain;
