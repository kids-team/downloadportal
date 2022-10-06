import { useContext } from 'react';
import { useParams } from "react-router-dom";
import Navigation from '../components/Navigation';
import { Verse } from '../services/models/bible';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const Bible = () => {
	const params = useParams();
	const { book, chapter } = params;
	const { state } = useContext(store)

	const bookId = state.bible.books.find(item => item.short_name === book) ?? 10;
	
	const args = {
		controller: 'bible',
		lang: state.lang,
		book: bookId,
		chapter
	}

	const url = useUrl(args);
	const {data, error} = useFetch<Array<Verse>>(url);	  

	return (
		<>
		<Navigation />
		<header className="header" style={{paddingTop: '20vh'}}>
			
			<div className="content">
				<div className="header__title">
					<h1 className="font-script">{state.bible.name}</h1>
					<h4 className="ml-4 xl:mr-0">{chapter}</h4>
				</div>
			</div>
			
		</header>
		<div className='section bg-gray-300 py-12'>
			<div className='content'>
				CONTROLS
			</div>
		</div>
		<section>
			<div className='container'>
			<ul>
				{ data?.map((verse) => {
					return <li><sup>{verse.verse}</sup>{verse.text}</li>
				}) }
			</ul>
			</div>
		</section>
		</>
	)
}

export default Bible