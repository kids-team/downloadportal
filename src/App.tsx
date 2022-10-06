import { useContext, useEffect } from "react";
import {
	BrowserRouter, Route, Routes
} from "react-router-dom";

import { IntlProvider } from 'react-intl';
import './App.css';
import Error from "./components/Error";
import Footer from "./components/Footer";
import ArticlePage from "./routes/ArticlePage";
import Bible from './routes/Bible';
import SearchPage from "./routes/SearchPage";
import Tag from "./routes/Tag";
import './scss/style.scss';
import { getUrl } from "./services/api";
import getTopLevelDomain from "./services/getTopLevelDomain";
import useTranslation from "./services/i18n";
import { store } from './services/store';

function App() {
	const globalState = useContext(store);
	const { state, dispatch } = globalState;

	const currentLanguage = state.lang;
	
	useEffect(() => {
		const args = {
			controller: 'site',
			lang: currentLanguage
		};
		const url = getUrl('/', args);
		dispatch({ type: 'SET_STATUS', payload: 'loading' });
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				dispatch({ type: 'SET_MENU', payload: data.menu });
				dispatch({ type: 'SET_FOOTER', payload: data.footer });
				dispatch({ type: 'SET_STATUS', payload: 'loaded' });
				dispatch({ type: 'SET_BIBLE', payload: data.bible })
			})
			.catch((error) => {
				console.log(error)
				dispatch({ type: 'SET_STATUS', payload: 'error'});
				dispatch({ type: 'SET_ERROR', payload: error});
			});

	}, [currentLanguage]);

	const messages = useTranslation(currentLanguage)

	if(state.error) return <Error message={`Server Error: ${state.error.toString()}`}/>

	return (
		<div className={`app ${getTopLevelDomain()}`}>
			<IntlProvider locale={currentLanguage} defaultLocale="en" messages={messages}>
			<BrowserRouter>
				<Routes>
					<Route path="bibel/:book/:chapter" element={<Bible />} />
					<Route path="search/:query" element={<SearchPage />} />
					<Route path="tag/:tag" element={<Tag />} />
					<Route path="*" element={<ArticlePage />} />
				</Routes>
			</BrowserRouter>
			<Footer />
			</IntlProvider>
		</div>
	);
};

export default App;
