import getTopLevelDomain from './getTopLevelDomain';

function getLanguageFromDomain(tld: string): string {
    if (['at', 'ch', 'de', 'internal'].includes(tld)) return 'de';
    if (['com', 'net', 'org'].includes(tld)) return 'en';
    if (tld === 'fr') return 'fr';
    if (tld === 'it') return 'it';
    return tld;
}

function getCurrentLanguage(availableLangs = ['de', 'fr', 'en']): string {
    const localLang = localStorage.getItem('dp_lang');
    if (localLang) return localLang;

    const browserLanguage =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0].slice(0, 2)
            : navigator.language.slice(0, 2);
    if (availableLangs.includes(browserLanguage)) return browserLanguage;

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
export { getFlagCode };
