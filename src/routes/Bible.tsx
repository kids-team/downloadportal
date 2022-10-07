import { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Combobox from '../components/Combobox';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import NumberSelect from '../components/NumberSelect';
import { Verse } from '../services/models/bible';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const Bible = () => {
	const params = useParams();
	const { book, chapter } = params;
	const { state } = useContext(store)


	const currentBook = state.bible.books.find((item) => { return item.short_name === book });

	const navigate = useNavigate();

	const args = {
		controller: 'bible',
		lang: state.lang,
		book: currentBook?.id ?? 10,
		chapter: chapter ?? 1
	}
	console.log(book, currentBook)
	const url = useUrl(args);
	const { data, error } = useFetch<Array<Verse>>(url);


	const tagUrl = useUrl({
		controller: 'tag',
		tag: currentBook?.short_name
	});

	const { data: tag, error: tagError } = useFetch(tagUrl);
	console.log(tag)

	const bibleurl = state.bible?.info?.url ?? "bible"
	const bookOptions = state.bible.books.map((book) => { return { label: book.long_name, value: book.short_name } })

	const setBook = (bookId: number | string) => {
		navigate(`/${bibleurl}/${bookId}/1`);
	}

	const setChapter = (chapter: number) => {
		navigate(`/${bibleurl}/${currentBook?.short_name ?? 'genesis'}/${chapter}`);
	}


	return (
		<>
			<Navigation />
			<Header title={currentBook?.long_name} subtitle={state.bible.info.chapter_string + ' ' + chapter ?? ''} />
			<div className='section bg-gray-300 py-12'>
				<div className='content flex gap'>
					<Combobox
						options={bookOptions}
						onChange={setBook}
						placeholder={currentBook?.long_name}
					/>
					<NumberSelect max={currentBook?.chapters ?? 1} min={1} onChange={setChapter} />
				</div>
			</div>
			<section>
				<div className='container grid grid--columns-4 grid--gap-4'>
					<div className='sm:grid__column--span-4 lg:grid__column--span-3'>
						<div>
							<ul>
								{data?.map((verse) => {
									return <li><sup>{verse.verse}</sup>{verse.text}</li>
								})}
							</ul>
						</div>
					</div>
					<div>
						<h4>Artikel</h4>
					</div>
				</div>
			</section>
		</>
	)
}

export default Bible