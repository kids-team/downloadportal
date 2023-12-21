import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { IntlProvider } from 'react-intl';
import './App.css';
import Error from './components/Error';
import Footer from './components/common/Footer';
import './scss/style.scss';
import { getUrl } from './services/api';
import getTopLevelDomain from './services/getTopLevelDomain';
import useTranslation from './services/i18n';
import router from './services/routes';
import { store } from './services/store';

function App() {
    const globalState = useContext(store);
    const { state, dispatch } = globalState;

    const currentLanguage = state.lang;

    useEffect(() => {
        const args = {
            controller: 'site',
            lang: currentLanguage,
        };
        const url = getUrl('/', args);
        dispatch({ type: 'SET_STATUS', payload: 'loading' });
        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'SET_MENU', payload: data.menu });
                dispatch({ type: 'SET_FOOTER', payload: data.footer });
                dispatch({ type: 'SET_STATUS', payload: 'loaded' });
                dispatch({ type: 'SET_BIBLE', payload: data.bible });
                dispatch({ type: 'SET_ORGANIZATION', payload: data.organizations });
                dispatch({ type: 'SET_TAXONOMIES', payload: data.taxonomies });
            })
            .catch(error => {
                console.log(error);
                dispatch({ type: 'SET_STATUS', payload: 'error' });
                dispatch({ type: 'SET_ERROR', payload: error });
            });
    }, [currentLanguage, dispatch]);

    const messages = useTranslation(currentLanguage);

    if (state.error) return <Error message={`Server Error: ${state.error.toString()}`} />;

    return (
        <div className={`app ${getTopLevelDomain()}`}>
            <IntlProvider locale={currentLanguage} defaultLocale="en" messages={messages}>
                <RouterProvider router={router} />

                <Footer />
            </IntlProvider>
        </div>
    );
}

export default App;
