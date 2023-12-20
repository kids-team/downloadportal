import { useContext } from 'react';
import { store } from './store';

type Params = Object;

const SERVER_URL = 'https://dlapi.kids-team.com';

function useUrl(params: Params = {}, path = '/') {
    const { state } = useContext(store);

    if (path[0] !== '/') path = '/' + path;
    path = path.replaceAll(':', '/');
    if (Object.keys(params).length === 0) return SERVER_URL + path;

    let args = Object.entries(params)
        .map(([key, value], index) => {
            return key + '=' + encodeURI(value);
        })
        .join('&');
    return `${SERVER_URL + path}&${args}&lang=${state.lang}`;
}

function useMediaUrl(id: string = '', size: number = 0) {
    const { state } = useContext(store);
    if (id === '') return '';
    const width: string = size ? '?w=' + size : '';
    return SERVER_URL + '/_media/' + id + '&lang=' + state.lang + width;
}

export { useMediaUrl };
export default useUrl;
