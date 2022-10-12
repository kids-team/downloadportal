import { useContext } from 'react';
import { getLink } from '../services/api';
import { Article } from '../services/models/article';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';
import ListItem from './ListItem';

type Props = {
	query: string;
	value: string;
	columns: number;
}

const ArticleList = (props: Props) => {

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
			{!data && !error && <div className={`grid grid--columns-${columns} grid--gap-12`}>{[...Array(6)].map((page, index) => {
				return (<li className='list__item'
					key={index}
				>
					<img className='list__image' />

				</li>)
			})}</div>}
			<div className={`list`}>{data?.map((page: Article, index: any) => {
				return (
					<ListItem
						title={page.title}
						description={page.abstract}
						image={page.pageimage}
						link={getLink(page.id)}
					/>

				)
			})}</div>
		</>
	)
}

ArticleList.defaultProps = {
	columns: 3,
};


export default ArticleList