import getTopLevelDomain from './getTopLevelDomain';

function getLanguageFromDomain(tld: string): string {
    if (['at', 'ch', 'de', 'internal'].includes(tld)) return 'de';
    if (['com', 'net', 'org'].includes(tld)) return 'en';
    if (tld === 'fr') return 'fr';
    if (tld === 'it') return 'it';
    return tld;
}

function getCurrentLanguage(availableLangs = ['de', 'fr', 'en']): string {
    const tld: string = getLanguageFromDomain(getTopLevelDomain());
    if (availableLangs.includes(tld)) return tld;
    return 'de';
}

function getFlagCode(language: string) {
    const domain = getTopLevelDomain();
    if (language === domain) return language;
    if (language === 'de' && ['ch', 'at'].includes(domain)) return domain;
    if (language === 'fr' && domain === 'ch') return 'rd';
    return language;
}

export default getCurrentLanguage;
export { getFlagCode, getLanguageFromDomain };
