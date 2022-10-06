import { useContext } from 'react';
import { Article } from '../services/models/article';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';
import Card from './Card';

type Props = {
	query: string;
	value: string;
	columns: number;
}

const ArticleCards = (props: Props) => {

	const { state } = useContext(store)
	const { query, value, columns = 3 } = props;

	const args = {
		controller: 'pages',
		query,
		value,
		lang: state.lang
	}

	const url = useUrl(args)

	const { data, error } = useFetch<Array<Article>>(url);


	return (
		<>
		{ !data && <div className={`grid grid--columns-${columns} grid--gap-12`}>{[...Array(6)].map((page, index) => {
			return(<div key={index} className='card card--image-top card--white card--shadow card--loading'>
				<div className='card__image'>
					
				</div>
				<div className='card__content'>
					<div className='card__title'>
						
					</div>
					<div className='card__text'>
						
					</div>
				</div>
				
				</div>)
		}) }</div> }
		<div className={`grid grid--columns-1 md:grid--columns-2 xl:grid--columns-${columns} grid--gap-12 mt-12`}>{ data?.map((page: Article, index: any) => {
			return (
				<Card 
					key={index}
					image={page.image?.src}
					title={page.title}
					label={page.category}
					text={page.abstract}
					link={page.id}
				/>
			)
		}) }</div>
		</>
	)
}

export default ArticleCards